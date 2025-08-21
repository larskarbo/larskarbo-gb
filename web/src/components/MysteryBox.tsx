import React, { useState, useEffect } from "react"
import { SuperLink } from "./SuperLink"

interface MysteryBoxProps {
  isVisible: boolean
}

export const MysteryBox: React.FC<MysteryBoxProps> = ({ isVisible }) => {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Delay content appearance for smooth animation
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isVisible])

  if(!showContent){
    return null
  }

  return (
    <div
      className={`fixed left-4 top-4 border-2 border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono p-4 max-w-sm transition-all duration-1000 ease-out z-50 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="animate-fade-in">
        <h2 className="text-sm font-bold mb-3">Achievement Unlocked</h2>
        <p className="text-xs mb-4">
          You're obviously very smart, I'd love to talk.
        </p>

        <div className="space-y-2 text-xs">
          <div>
            book a 30min{" "}
            <a
              href="https://calendar.notion.so/meet/larskarb/30-mins"
              className="underline hover:no-underline"
            >
              call
            </a>
          </div>

          <div>send me a message: {"+47970" + "82" + "750"}</div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
