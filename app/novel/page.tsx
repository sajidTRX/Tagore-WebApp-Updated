"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  History,
  FileOutputIcon as FileExport,
  Sparkles,
  BookOpen,
  Check,
  AlertTriangle,
  BookText,
  Users,
  Wand2,
  Pencil,
  FileText,
  Clock,
  LayoutGrid,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import NovelSidebar from "@/components/novel-sidebar"
import AIWritingAssistant from "@/components/ai-writing-assistant"
import GrammarChecker from "@/components/grammar-checker"
import BookCompiler from "@/components/book-compiler"
import FeaturePanel from "@/components/feature-panel"
import { Badge } from "@/components/ui/badge"

export default function NovelMode() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("My Novel")
  const [chapter, setChapter] = useState("Chapter 1")
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saving" | "saved" | "error">("saved")
  const [snapshots, setSnapshots] = useState<{ timestamp: Date; content: string }[]>([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [showAIAssist, setShowAIAssist] = useState(false)
  const [showGrammarCheck, setShowGrammarCheck] = useState(false)
  const [showBookCompiler, setShowBookCompiler] = useState(false)
  const [fontSize, setFontSize] = useState("16px")
  const [fontFamily, setFontFamily] = useState("font-serif")
  const [wordCount, setWordCount] = useState(0)
  const [grammarIssues, setGrammarIssues] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Novel mode features for the feature panel
  const novelFeatures = [
    {
      category: "Writing & Organization",
      items: [
        {
          title: "Chapter Management",
          description: "Create, edit, reorder, and merge chapters for better organization.",
          shortcut: "Ctrl+J",
          icon: <BookText className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Auto-Save",
          description: "Your work is automatically saved every few minutes.",
          icon: <Save className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Version History",
          description: "Access previous versions of your writing with timestamps.",
          shortcut: "Ctrl+H",
          icon: <History className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Book Compilation",
          description: "Compile all chapters into a complete manuscript for export.",
          shortcut: "Ctrl+E",
          icon: <FileExport className="h-4 w-4 text-gray-700" />,
        },
      ],
    },
    {
      category: "AI Assistance",
      items: [
        {
          title: "Writing Suggestions",
          description: "Get AI-powered suggestions to continue your writing.",
          shortcut: "Ctrl+A",
          icon: <Sparkles className="h-4 w-4 text-gray-700" />,
          premium: true,
        },
        {
          title: "Character Development",
          description: "Generate character profiles, names, and backstories.",
          icon: <Users className="h-4 w-4 text-gray-700" />,
          premium: true,
        },
        {
          title: "Plot Ideas",
          description: "Get suggestions for plot twists, conflicts, and resolutions.",
          icon: <Wand2 className="h-4 w-4 text-gray-700" />,
          premium: true,
        },
        {
          title: "Paraphrasing Tool",
          description: "Rewrite sentences or paragraphs with different wording.",
          icon: <Pencil className="h-4 w-4 text-gray-700" />,
          isNew: true,
          premium: true,
        },
      ],
    },
    {
      category: "Grammar & Style",
      items: [
        {
          title: "Grammar Checker",
          description: "Identify and fix grammar, punctuation, and spelling issues.",
          shortcut: "Ctrl+G",
          icon: <AlertTriangle className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Style Analysis",
          description: "Get feedback on readability, sentence variety, and word choice.",
          icon: <FileText className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Reading Time Estimator",
          description: "Calculate estimated reading time for your content.",
          icon: <Clock className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Structure Visualization",
          description: "Visualize your novel's structure and pacing.",
          icon: <LayoutGrid className="h-4 w-4 text-gray-700" />,
          isNew: true,
        },
      ],
    },
  ]

  // Calculate word count when content changes
  useEffect(() => {
    setWordCount(content.split(/\s+/).filter(Boolean).length)

    // Mock grammar check
    const issues = Math.floor(Math.random() * 3)
    setGrammarIssues(issues)
  }, [content])

  // Auto-save functionality
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setAutoSaveStatus("saving")
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem("novel-content", content)
        localStorage.setItem("novel-title", title)
        localStorage.setItem("novel-chapter", chapter)
        setSnapshots([...snapshots, { timestamp: new Date(), content }])
        setAutoSaveStatus("saved")
      } catch (error) {
        setAutoSaveStatus("error")
      }
    }, 1000)

    return () => clearTimeout(saveTimeout)
  }, [content, title, chapter, snapshots])

  // Load saved content on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedContent = localStorage.getItem("novel-content")
    const savedTitle = localStorage.getItem("novel-title")
    const savedChapter = localStorage.getItem("novel-chapter")

    if (savedContent) setContent(savedContent)
    if (savedTitle) setTitle(savedTitle)
    if (savedChapter) setChapter(savedChapter)
  }, [])

  // Apply font size to the writing interface
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.style.setProperty("--font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.style.setProperty("--font-family", fontFamily);
  }, [fontFamily]);

  // Focus the textarea on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: Save
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        setAutoSaveStatus("saving")
        setTimeout(() => {
          try {
            localStorage.setItem("novel-content", content)
            setAutoSaveStatus("saved")
          } catch (error) {
            setAutoSaveStatus("error")
          }
        }, 500)
      }
      // Ctrl+H: History
      else if (e.ctrlKey && e.key === "h") {
        e.preventDefault()
        router.push("/history")
      }
      // Ctrl+E: Export/Book Compiler
      else if (e.ctrlKey && e.key === "e") {
        e.preventDefault()
        setShowBookCompiler(true)
      }
      // Ctrl+J: Toggle chapter navigator
      else if (e.ctrlKey && e.key === "j") {
        e.preventDefault()
        setShowSidebar(!showSidebar)
      }
      // Ctrl+A: AI Assist
      else if (e.ctrlKey && e.key === "a") {
        e.preventDefault()
        if (isPremium) {
          setShowAIAssist(true)
        } else {
          setShowPremiumPrompt(true)
        }
      }
      // Ctrl+G: Grammar Check
      else if (e.ctrlKey && e.key === "g") {
        e.preventDefault()
        setShowGrammarCheck(!showGrammarCheck)
      }
      // Escape: Go back to home
      else if (e.key === "Escape") {
        router.push("/home")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, showSidebar, showAIAssist, showGrammarCheck, content, snapshots])

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Chapter Navigator Sidebar */}
      {showSidebar && (
        <NovelSidebar
          onClose={() => setShowSidebar(false)}
          onSelectChapter={(newChapter) => {
            setChapter(newChapter)
            setShowSidebar(false)
          }}
          currentChapter={chapter}
        />
      )}

      {/* Main Writing Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent font-serif text-xl font-medium text-gray-800 focus:outline-none"
            />
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {autoSaveStatus === "saving" && <span>Saving...</span>}
              {autoSaveStatus === "saved" && (
                <span className="flex items-center">
                  <Check className="mr-1 h-3 w-3 text-gray-500" /> Saved
                </span>
              )}
              {autoSaveStatus === "error" && (
                <span className="flex items-center text-gray-700">
                  <AlertTriangle className="mr-1 h-3 w-3 text-gray-700" /> Error saving
                </span>
              )}
            </div>
          </div>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="mt-1 w-full bg-transparent font-serif text-lg text-gray-600 focus:outline-none"
          />
        </div>

        {/* Writing Area */}
        <div className="flex-1 overflow-auto p-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full w-full resize-none bg-transparent font-serif text-lg leading-relaxed text-gray-800 focus:outline-none"
            placeholder="Start writing..."
          />
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Save className="h-4 w-4" />
              <span>Ctrl+S Save</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => isPremium ? setShowAIAssist(true) : setShowPremiumPrompt(true)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Ctrl+A AI Assist</span>
              {!isPremium && <Lock className="ml-1 h-3 w-3 text-amber-500" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setShowGrammarCheck(true)}
            >
              <AlertTriangle className={`h-4 w-4 ${grammarIssues > 0 ? "text-gray-700" : ""}`} />
              <span>Ctrl+G Grammar {grammarIssues > 0 ? `(${grammarIssues})` : ""}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => router.push("/history")}
            >
              <History className="h-4 w-4" />
              <span>Ctrl+H History</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setShowBookCompiler(true)}
            >
              <FileExport className="h-4 w-4" />
              <span>Ctrl+E Export</span>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setShowSidebar(true)}
            >
              <BookOpen className="h-4 w-4" />
              <span>Ctrl+J Chapters</span>
            </Button>
            <span>{wordCount} words</span>
          </div>
        </div>
      </div>

      {/* Feature Panel */}
      <FeaturePanel features={novelFeatures} mode="Novel" />

      {/* AI Assistant Dialog */}
      <Dialog open={showAIAssist} onOpenChange={setShowAIAssist}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI Writing Assistant</DialogTitle>
          </DialogHeader>
          <AIWritingAssistant
            currentText={content}
            onInsertText={(text) => {
              setContent(content + text)
              setShowAIAssist(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Grammar Checker Dialog */}
      <Dialog open={showGrammarCheck} onOpenChange={setShowGrammarCheck}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grammar & Style Check</DialogTitle>
          </DialogHeader>
          <GrammarChecker
            text={content}
            onApplyFix={(fixedText) => {
              setContent(fixedText)
              setShowGrammarCheck(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Book Compiler Dialog */}
      <Dialog open={showBookCompiler} onOpenChange={setShowBookCompiler}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Compiler</DialogTitle>
          </DialogHeader>
          <BookCompiler bookTitle={title} currentChapter={chapter} />
        </DialogContent>
      </Dialog>

      {/* Premium Feature Upgrade Dialog */}
      <Dialog open={showPremiumPrompt} onOpenChange={setShowPremiumPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
              Premium Feature
            </DialogTitle>
            <DialogDescription>
              AI Writing Assistant requires a premium subscription
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-gradient-to-r from-amber-50 to-amber-100 p-4 border border-amber-200">
              <h4 className="font-medium mb-2 text-amber-800">Upgrade to Premium</h4>
              <p className="text-xs text-amber-700 mb-3">Unlock advanced AI features including:</p>
              <ul className="text-xs text-amber-700 space-y-1 mb-3">
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> AI Writing Assistant</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> Advanced character development</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> Plot consistency analysis</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> Style and tone enhancement</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumPrompt(false)}>
              Maybe Later
            </Button>
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                // For demo purposes, let's make the user premium immediately
                setIsPremium(true);
                setShowPremiumPrompt(false);
                setShowAIAssist(true);
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
