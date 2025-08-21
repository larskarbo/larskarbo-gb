import React, { useState, useEffect } from "react"

interface DrawingInstructionProps {
  lineStart: { x: number; y: number }
  lineEnd: { x: number; y: number }
}

export const DrawingInstruction: React.FC<DrawingInstructionProps> = ({
  lineStart,
  lineEnd,
}) => {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content after 1200ms delay
    const startTimer = setTimeout(() => {
      setShowContent(true)
    }, 1200)

    return () => clearTimeout(startTimer)
  }, [])

  // Constants for line positioning
  const LINE_LENGTH = 60 // Distance from line end to line start
  const LINE_ANGLE = -Math.PI / 4 // -45 degrees (up and to the right)

  // Calculate line start position based on angle and length
  const lineStartX = lineEnd.x + LINE_LENGTH * Math.cos(LINE_ANGLE)
  const lineStartY = lineEnd.y + LINE_LENGTH * Math.sin(LINE_ANGLE)
  const lineEndX = lineEnd.x
  const lineEndY = lineEnd.y

  // Calculate angle of the line
  const dx = lineEndX - lineStartX
  const dy = lineEndY - lineStartY
  const angle = Math.atan2(dy, dx)

  const DISTANCE_FROM_LINE_END = 20
  const adjustedEndX = lineEndX - DISTANCE_FROM_LINE_END * Math.cos(angle)
  const adjustedEndY = lineEndY - DISTANCE_FROM_LINE_END * Math.sin(angle)

  if (!showContent) return null

  return (
    <>
      {/* Arrow line with fade-in animation */}
      <svg
        className="absolute z-20 pointer-events-none animate-fade-in"
        style={{
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Main pointing line */}
        <line
          x1={lineStartX}
          y1={lineStartY}
          x2={adjustedEndX}
          y2={adjustedEndY}
          stroke="gray"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Text with fade-in animation */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: lineStartX - 30,
          top: lineStartY - 25,
        }}
      >
        <div style={{
          fontSize: "10px",
        }} className=" text-gray-600 dark:text-gray-400 whitespace-nowrap animate-fade-in font-bold">
          plz, do not draw a circle
        </div>
      </div>
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
