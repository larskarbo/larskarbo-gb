import { useEffect, useRef, useState } from "react"
import { easeInOutQuint, easeOutQuint } from "./easings"
import { sample } from "lodash"

export function LineDrawing() {
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
      // const isIn20PercentLeftScreen = e.clientX < window.innerWidth * 0.2;

      // if (!isIn20PercentLeftScreen) {
      //   return;
      // }

      mouseDown = !mouseDown
      lastPosition = {
        x: e.clientX * window.devicePixelRatio,
        y: e.clientY * window.devicePixelRatio,
      }
      linePoints = []
      linePoints.push(lastPosition)

      // make global css text selection not happen
      window.document.body.style.userSelect = "none"
    }

    const lineCrossAnimationDuration = 1000

    let lineCrosses = [] as {
      timestamp: number
      multiplier: number
    }[]

    const availableColors = ["#E60C0C", "#19A316", "#0DAFA5", "#B579F2"]
    let currentColor: string = availableColors[0]!
    let pointsThatArePrettyClose = []
    const onMove = (e: MouseEvent) => {
      if (mouseDown) {
        const newPosition = {
          x: e.clientX * window.devicePixelRatio,
          y: e.clientY * window.devicePixelRatio,
        }
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

        console.log("pointsToIgnoreIndex: ", pointsToIgnoreIndex)
        pointsThatArePrettyClose = pointsWithDistanceInfo
          .slice(0, Math.min(-pointsToIgnoreIndex, -2))
          .filter((p, i) => {
            return p.dist < 400 && !!p.prev
          })

        let didCross = false
        const lastPoint = linePoints[linePoints.length - 2]
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
          lineCrosses.push({
            timestamp: Date.now(),
            multiplier: lineCrossesThatMatter.length + 1,
          })
          const isFirstTime = lineCrosses.length === 1
          currentColor = isFirstTime
            ? availableColors[1] // i want green to be the first color it changes to
            : sample(availableColors.filter(c => c !== currentColor))!
        }
      }
    }

    const onUp = (e: MouseEvent) => {
      mouseDown = false

      window.document.body.style.userSelect = "auto"
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
          console.log("progress: ", progress)
          ctx.save()
          ctx.globalAlpha = 0.6 - easeOutQuint(progress) * 0.6
          ctx.strokeStyle = currentColor
          ctx.lineWidth =
            easeOutQuint(progress) * 200 - (lineCross.multiplier - 1) * 10
          ctx.stroke()
          ctx.restore()
        }
      })

      // draw small circles at every point

      // pointsThatArePrettyClose
      // pointsThatArePrettyClose.forEach((point, i) => {
      //   ctx.beginPath()
      //   ctx.fillStyle = availableColors[i % availableColors.length]
      //   ctx.strokeStyle = availableColors[i % availableColors.length]
      //   ctx.arc(point.prev.x, point.prev.y, 2, 0, Math.PI * 2)
      //   ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)

      //   ctx.fill()
      //   ctx.moveTo(point.prev.x, point.prev.y)
      //   ctx.lineTo(point.x, point.y)
      //   ctx.lineWidth = 1
      //   ctx.stroke()
      // })

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

    canvas.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)

    return () => {
      canvas.removeEventListener("mousedown", onDown)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [ctx1])

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
