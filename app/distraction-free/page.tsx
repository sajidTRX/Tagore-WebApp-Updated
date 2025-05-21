"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  FileText,
  History,
  Minimize2,
  Eye,
  EyeOff,
  Timer,
  Save,
  Moon,
  Sun,
  Keyboard,
  Maximize,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import FeaturePanel from "@/components/feature-panel"

interface DistractionFreeFeature {
  category: string
  items: {
    title: string
    description: string
    shortcut?: string
    icon: React.ReactNode
    isNew?: boolean
  }[]
}

export default function DistractionFreeMode() {
  const [content, setContent] = useState("The page was white and endless. Words flowed like...")
  const [showTopBar, setShowTopBar] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState("16px")
  const [fontFamily, setFontFamily] = useState("font-mono"); // Changed font to font-mono
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Distraction-free mode features for the feature panel
  const distractionFreeFeatures: DistractionFreeFeature[] = [
    {
      category: "Focus Tools",
      items: [
        {
          title: "Minimal Interface",
          description: "Hide all UI elements for complete focus on writing.",
          icon: <Minimize2 className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Focus Timer",
          description: "Track your writing time with a built-in timer.",
          shortcut: "Ctrl+T",
          icon: <Timer className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Word Count",
          description: "Track your progress with a real-time word counter.",
          shortcut: "Ctrl+W",
          icon: <FileText className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Fullscreen Mode",
          description: "Maximize your writing space by going fullscreen.",
          shortcut: "F11",
          icon: <Maximize className="h-4 w-4 text-gray-700" />,
          isNew: true,
        },
      ],
    },
    {
      category: "Visual Comfort",
      items: [
        {
          title: "Dark Mode",
          description: "Switch to a dark theme for reduced eye strain.",
          shortcut: "Ctrl+D",
          icon: <Moon className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Light Mode",
          description: "Switch to a light theme for better visibility.",
          shortcut: "Ctrl+L",
          icon: <Sun className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Hide Cursor",
          description: "Hide the cursor when not typing for fewer distractions.",
          icon: <EyeOff className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Typewriter Mode",
          description: "Keep the cursor centered vertically on the screen.",
          icon: <Keyboard className="h-4 w-4 text-gray-700" />,
          isNew: true,
        },
      ],
    },
    {
      category: "Session Management",
      items: [
        {
          title: "Auto-Save",
          description: "Your work is automatically saved as you type.",
          icon: <Save className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Session History",
          description: "Access previous writing sessions with timestamps.",
          shortcut: "Ctrl+H",
          icon: <History className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Writing Statistics",
          description: "View detailed statistics about your writing session.",
          icon: <FileText className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Focus Analytics",
          description: "Track your focus and productivity over time.",
          icon: <Eye className="h-4 w-4 text-gray-700" />,
          isNew: true,
        },
      ],
    },
  ]

  // Calculate word count when content changes
  useEffect(() => {
    setWordCount(content.split(/\s+/).filter(Boolean).length)
  }, [content])

  // Timer functionality
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let interval: NodeJS.Timeout | undefined
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev: number) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive])

  // Format timer as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Focus the textarea on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Handle keyboard shortcuts and show/hide top bar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show top bar on any key press
      setShowTopBar(true)

      // Hide top bar after 3 seconds of inactivity
      const hideTimeout = setTimeout(() => {
        setShowTopBar(false)
      }, 3000)

      // Ctrl+W: Word Count
      if (e.ctrlKey && e.key === "w") {
        e.preventDefault()
        alert(`Word count: ${wordCount}`)
      }
      // Ctrl+T: Timer toggle
      else if (e.ctrlKey && e.key === "t") {
        e.preventDefault()
        setTimerActive(!timerActive)
      }
      // Ctrl+H: History
      else if (e.ctrlKey && e.key === "h") {
        e.preventDefault()
        router.push("/history")
      }
      // Ctrl+D: Dark Mode
      else if (e.ctrlKey && e.key === "d") {
        e.preventDefault()
        setDarkMode(true)
      }
      // Ctrl+L: Light Mode
      else if (e.ctrlKey && e.key === "l") {
        e.preventDefault()
        setDarkMode(false)
      }
      // F11: Fullscreen
      else if (e.key === "F11") {
        e.preventDefault()
        setFullscreen(!fullscreen)
        // In a real implementation, we would use the Fullscreen API here
      }
      // Escape: Go back to home
      else if (e.key === "Escape") {
        router.push("/home")
      }

      return () => clearTimeout(hideTimeout)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, wordCount, timerActive, darkMode, fullscreen])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.style.setProperty("--font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.style.setProperty("--font-family", fontFamily);
  }, [fontFamily]);

  return (
    <div className={`flex h-screen w-full ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="flex flex-1 flex-col">
        {/* Top Bar (only visible when showTopBar is true) */}
        <div
          className={`flex items-center justify-between border-b ${
            darkMode ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-gray-50 text-gray-600"
          } px-4 py-2 text-sm transition-opacity duration-300 ${showTopBar ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Ctrl+W Word Count: {wordCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Ctrl+T Timer: {formatTime(timer)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <History className="h-4 w-4" />
              <span>Ctrl+H Session History</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 p-0"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 p-0"
              onClick={() => setFullscreen(!fullscreen)}
            >
              <Maximize className="h-4 w-4" />
              <span>{fullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </Button>
          </div>
        </div>

        {/* Writing Area */}
        <div className="flex-1 p-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            className={`h-full w-full resize-none bg-transparent font-mono text-lg leading-relaxed ${
              darkMode ? "text-gray-200" : "text-gray-800"
            } focus:outline-none`}
            placeholder="Start writing..."
          />
        </div>
      </div>

      {/* Feature Panel */}
      <FeaturePanel features={distractionFreeFeatures} mode="Distraction-Free" />
    </div>
  )
}
