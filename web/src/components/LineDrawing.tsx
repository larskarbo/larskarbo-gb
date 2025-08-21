import { useEffect, useRef, useState, useCallback } from "react"
import { easeInOutQuint, easeOutQuint } from "./easings"
import { sample } from "lodash"

interface LineDrawingProps {
  initialLine?: {
    start: { x: number; y: number }
    end: { x: number; y: number }
  }
  onManualDrawingStart?: () => void
  onFirstCircle?: () => void
  onSecondCircle?: () => void
}

export function LineDrawing({ initialLine, onManualDrawingStart, onFirstCircle, onSecondCircle }: LineDrawingProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ctx1, setCtx1] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const canvas = canvasRef.current

    const visibleW = window.innerWidth
    const visibleH = window.innerHeight

    canvas.width = visibleW * window.devicePixelRatio
    canvas.height = visibleH * window.devicePixelRatio

    canvas.style.width = visibleW + "px"
    canvas.style.height = visibleH + "px"

    setCtx1(canvas.getContext("2d")!)
  }, [])

  useEffect(() => {
    if (!ctx1) {
      return
    }

    const ctx = ctx1
    const canvas = ctx.canvas
    const w = canvas.width
    const h = canvas.height
    const cX = w / 2
    const cY = h / 2

    ctx.clearRect(0, 0, w, h)
    ctx.lineJoin = "round"

    let lastPosition = { x: cX, y: cY }
    let mouseDown = false
    let isDrawing = false

    const particles = [] as {
      x: number
      y: number
      vx: number
      vy: number
      createdAtMs: number
      color: string
    }[]

    let linePoints = [] as { x: number; y: number }[]

    const onDown = (e: MouseEvent) => {
      mouseDown = !mouseDown
      const position = {
        x: e.clientX * window.devicePixelRatio,
        y: e.clientY * window.devicePixelRatio,
      }
      
      if (mouseDown) {
        // Call the callback when manual drawing starts
        if (onManualDrawingStart) {
          onManualDrawingStart()
        }
        startDrawing(position)
      } else {
        stopDrawing()
      }
    }

    const lineCrossAnimationDuration = 1000

    let lineCrosses = [] as {
      timestamp: number
      multiplier: number
      isValid?: boolean
    }[]

    const availableColors = ["#E60C0C", "#19A316", "#0DAFA5", "#B579F2"]
    let currentColor: string = availableColors[0]!
    let pointsThatArePrettyClose = []

    // Programmatic drawing functions
    const startDrawing = (startPoint: { x: number; y: number }) => {
      isDrawing = true
      lastPosition = startPoint
      linePoints = []
      linePoints.push(lastPosition)
      
      // Disable text selection when drawing starts
      window.document.body.style.userSelect = "none"
    }

    const addPoint = (newPosition: { x: number; y: number }) => {
      if (!isDrawing) return
      
      lastPosition = newPosition
      linePoints.push(lastPosition)

      const NUM_PARTICLES = 1
      // create some particles
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = {
          x: lastPosition.x,
          y: lastPosition.y,
          vx: Math.random() * 10 - 5,
          vy: Math.random() * 10 - 5,
          createdAtMs: Date.now(),
          color: currentColor,
        }
        particles.push(p)
      }

      const point = newPosition

      const lastLineCross = lineCrosses[lineCrosses.length - 1]
      if (lastLineCross && Date.now() - lastLineCross.timestamp < 100) {
        return
      }

      const pointsWithDistanceInfo = linePoints.map((p, i) => {
        const dist = Math.sqrt(
          Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
        )
        return { ...p, i, dist, prev: linePoints[i - 1] }
      })

      // ignore all points at the end until distance becomes high ish
      const pointsToIgnoreIndex = [...pointsWithDistanceInfo]
        .reverse()
        .findIndex(p => p.dist > 40)

      pointsThatArePrettyClose = pointsWithDistanceInfo
        .slice(0, Math.min(-pointsToIgnoreIndex, -2))
        .filter((p, i) => {
          return p.dist < 400 && !!p.prev
        })

      let didCross = false
      const lastPoint = linePoints[linePoints.length - 2]
      if (lastPoint) {
        const thisSegment = {
          x1: lastPoint.x,
          y1: lastPoint.y,
          x2: point.x,
          y2: point.y,
        }

        pointsThatArePrettyClose.forEach(p => {
          const prev = p.prev
          if (!prev) {
            return
          }
          const prevSegment = {
            x1: prev.x,
            y1: prev.y,
            x2: p.x,
            y2: p.y,
          }
          if (doLineSegmentsIntersect(thisSegment, prevSegment)) {
            didCross = true
          }
        })

        if (didCross) {
          const lineCrossesThatMatter = lineCrosses.filter(
            lc => Date.now() - lc.timestamp < lineCrossAnimationDuration
          )
          
          // Calculate bounding box of the drawn line
          const getBoundingBox = (points: { x: number; y: number }[]) => {
            if (points.length === 0) return { width: 0, height: 0 }
            
            const xs = points.map(p => p.x)
            const ys = points.map(p => p.y)
            const minX = Math.min(...xs)
            const maxX = Math.max(...xs)
            const minY = Math.min(...ys)
            const maxY = Math.max(...ys)
            
            return {
              width: maxX - minX,
              height: maxY - minY,
              minX,
              maxX,
              minY,
              maxY
            }
          }
          
          const boundingBox = getBoundingBox(linePoints)
          const minCircleSize = 80 // Minimum size for a "proper" circle in canvas pixels
          const isBigEnoughCircle = Math.min(boundingBox.width, boundingBox.height) > minCircleSize
          
          // Only count circles that are big enough for the first circle logic
          const validCircles = lineCrosses.filter(lc => lc.isValid !== false)
          const isFirstValidCircle = validCircles.length === 0 && isBigEnoughCircle
          const isSecondValidCircle = validCircles.length === 1
          
          lineCrosses.push({
            timestamp: Date.now(),
            multiplier: lineCrossesThatMatter.length + 1,
            isValid: isBigEnoughCircle
          })
          
          // Only trigger first circle callback if it's big enough
          if (isFirstValidCircle && onFirstCircle) {
            console.log("First valid circle detected!")
            onFirstCircle()
          }
          
          if (isSecondValidCircle && onSecondCircle) {
            console.log("Second circle detected!")
            onSecondCircle()
          }
          
          currentColor = isFirstValidCircle
            ? availableColors[1] // i want green to be the first color it changes to
            : sample(availableColors.filter(c => c !== currentColor))!
        }
      }
    }

    const stopDrawing = () => {
      isDrawing = false
      window.document.body.style.userSelect = "auto"
    }
    const onMove = (e: MouseEvent) => {
      if (mouseDown) {
        const newPosition = {
          x: e.clientX * window.devicePixelRatio,
          y: e.clientY * window.devicePixelRatio,
        }
        addPoint(newPosition)
      }
    }

    const onUp = (e: MouseEvent) => {
      mouseDown = false
      stopDrawing()
    }

    const render = () => {
      ctx.save()
      ctx.clearRect(0, 0, w, h)

      // draw line

      ctx.beginPath()
      linePoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })

      ctx.strokeStyle = currentColor
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.globalAlpha = 0.15
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 40
      ctx.lineCap = "round"
      ctx.stroke()
      ctx.globalAlpha = 1

      const now = Date.now()

      const lineCrossesThatMatter = lineCrosses.filter(
        lc => now - lc.timestamp < lineCrossAnimationDuration
      )

      lineCrossesThatMatter.forEach((lineCross, i) => {
        if (now - lineCross.timestamp < lineCrossAnimationDuration) {
          const progress =
            (now - lineCross.timestamp) / lineCrossAnimationDuration
          ctx.save()
          ctx.globalAlpha = 0.6 - easeOutQuint(progress) * 0.6
          ctx.strokeStyle = currentColor
          ctx.lineWidth =
            easeOutQuint(progress) * 200 - (lineCross.multiplier - 1) * 10
          ctx.stroke()
          ctx.restore()
        }
      })

      const LIFE_TIME = 600

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const age = now - p.createdAtMs
        const agePct = age / LIFE_TIME
        const radius = 5
        const alpha = 1 - agePct
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1
        p.x += p.vx
        p.y += p.vy
      }
      particles.forEach((p, i) => {
        if (now - p.createdAtMs > LIFE_TIME) {
          particles.splice(i, 1)
        }
      })
      ctx.restore()
    }

    const onTick = () => {
      render()
      requestAnimationFrame(onTick)
    }

    requestAnimationFrame(onTick)

    // Add initial segment if provided
    if (initialLine) {
      // Convert percentage/viewport coordinates to canvas coordinates
      const startX = initialLine.start.x * window.devicePixelRatio
      const startY = initialLine.start.y * window.devicePixelRatio
      const endX = initialLine.end.x * window.devicePixelRatio
      const endY = initialLine.end.y * window.devicePixelRatio
      
      startDrawing({ x: startX, y: startY })
      
      // Animate drawing the initial segment over time
      let progress = 0
      const animateInitialSegment = () => {
        progress += 0.02
        if (progress <= 1) {
          const currentX = startX + (endX - startX) * progress
          const currentY = startY + (endY - startY) * progress
          addPoint({ x: currentX, y: currentY })
          requestAnimationFrame(animateInitialSegment)
        } else {
          stopDrawing()
        }
      }
      
      // Start the animation after a brief delay
      setTimeout(() => {
        animateInitialSegment()
      }, 500)
    }

    // Always add mouse event listeners
    canvas.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)

    return () => {
      canvas.removeEventListener("mousedown", onDown)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [ctx1,])

  return (
    <div className="w-screen h-screen absolute top-0 left-0 z-0" style={{}}>
      <canvas
        className={`absolute inset-0 ease-in-out`}
        ref={canvasRef}
      ></canvas>
    </div>
  )
}

export default LineDrawing

function doLineSegmentsIntersect(
  segment1: { x1: number; y1: number; x2: number; y2: number },
  segment2: { x1: number; y1: number; x2: number; y2: number }
) {
  const { x1: x1, y1: y1, x2: x2, y2: y2 } = segment1
  const { x1: x3, y1: y3, x2: x4, y2: y4 } = segment2

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // If the denominator is zero, the lines are parallel
  if (denominator === 0) {
    return false
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // If ua and ub are between 0 and 1, the segments intersect
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1
}
