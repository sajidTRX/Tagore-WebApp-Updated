"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  History,
  Sparkles,
  Calculator,
  FileOutput,
  BookOpen,
  FileText,
  PenTool,
  Sigma,
  Lightbulb,
  BookMarked,
  Download,
  Share2,
  Lock,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import SymbolPicker from "@/components/symbol-picker"
import AIStudyTools from "@/components/ai-study-tools"
import NotebookSelector from "@/components/notebook-selector"
import NoteExporter from "@/components/note-exporter"
import FeaturePanel from "@/components/feature-panel"
import { Badge } from "@/components/ui/badge"

export default function NoteMode() {
  const [content, setContent] = useState("The first law states that...")
  const [notebook, setNotebook] = useState("Physics")
  const [title, setTitle] = useState("Laws of Thermodynamics")
  const [tags, setTags] = useState(["physics", "thermodynamics", "science"])
  const [showSymbols, setShowSymbols] = useState(false)
  const [showAITools, setShowAITools] = useState(false)
  const [showNotebooks, setShowNotebooks] = useState(false)
  const [showExporter, setShowExporter] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved") // 'saving', 'saved', 'error'
  const [fontSize, setFontSize] = useState("16px"); // Default font size
  const [fontFamily, setFontFamily] = useState("font-mono"); // Changed font to font-mono
  const [isPremium, setIsPremium] = useState(false)
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Note mode features for the feature panel
  const noteFeatures = [
    {
      category: "Organization & Structure",
      items: [
        {
          title: "Notebook System",
          description: "Organize notes into subject-based notebooks for better organization.",
          shortcut: "Ctrl+O",
          icon: <BookMarked className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Tag Management",
          description: "Add and organize tags to quickly find related notes.",
          icon: <FileText className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Auto-Save",
          description: "Your notes are automatically saved as you type.",
          icon: <Save className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Version History",
          description: "Access previous versions of your notes with timestamps.",
          shortcut: "Ctrl+H",
          icon: <History className="h-4 w-4 text-gray-700" />,
        },
      ],
    },
    {
      category: "Scientific & Math Tools",
      items: [
        {
          title: "Symbol Picker",
          description: "Insert mathematical, Greek, and scientific symbols.",
          shortcut: "Ctrl+M",
          icon: <Sigma className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Formula Support",
          description: "Write complex formulas with superscript and subscript.",
          icon: <Calculator className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Physics Symbols",
          description: "Specialized symbols for physics equations and constants.",
          icon: <PenTool className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Chemical Formulas",
          description: "Support for chemical formulas and equations.",
          icon: <FileText className="h-4 w-4 text-gray-700" />,
          isNew: true,
        },
      ],
    },
    {
      category: "AI Study Assistance",
      items: [
        {
          title: "Note Summarization",
          description: "AI-powered summaries of your notes for quick review.",
          shortcut: "Ctrl+A",
          icon: <Sparkles className="h-4 w-4 text-gray-700" />,
          premium: true,
        },
        {
          title: "Concept Explanation",
          description: "Get detailed explanations of complex concepts.",
          icon: <Lightbulb className="h-4 w-4 text-gray-700" />,
          premium: true,
        },
        {
          title: "Flashcard Generation",
          description: "Convert your notes into study flashcards automatically.",
          icon: <BookOpen className="h-4 w-4 text-gray-700" />,
          premium: true,
        },
        {
          title: "Structure Formatter",
          description: "Automatically format raw notes into structured content.",
          icon: <FileText className="h-4 w-4 text-gray-700" />,
          isNew: true,
          premium: true,
        },
      ],
    },
    {
      category: "Export & Sharing",
      items: [
        {
          title: "PDF Export",
          description: "Export your notes as PDF documents.",
          shortcut: "Ctrl+E",
          icon: <FileOutput className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Word Export",
          description: "Export your notes as Word documents.",
          icon: <Download className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Plain Text Export",
          description: "Export your notes as plain text files.",
          icon: <FileText className="h-4 w-4 text-gray-700" />,
        },
        {
          title: "Share Notes",
          description: "Share your notes via email or link.",
          icon: <Share2 className="h-4 w-4 text-gray-700" />,
          isNew: true,
        },
      ],
    },
  ]

  // Focus the textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Focus tag input when shown
  useEffect(() => {
    if (showTagInput && tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }, [showTagInput])

  // Auto-save functionality
  useEffect(() => {
    setAutoSaveStatus("saving")
    const saveTimeout = setTimeout(() => {
      setAutoSaveStatus("saved")
    }, 1000)

    return () => clearTimeout(saveTimeout)
  }, [content, title, notebook, tags])

  // Apply font size to the writing interface
  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-family", fontFamily);
  }, [fontFamily]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: Save
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        setAutoSaveStatus("saving")
        setTimeout(() => {
          setAutoSaveStatus("saved")
        }, 500)
      }
      // Ctrl+H: History
      else if (e.ctrlKey && e.key === "h") {
        e.preventDefault()
        router.push("/history")
      }
      // Ctrl+M: Symbols
      else if (e.ctrlKey && e.key === "m") {
        e.preventDefault()
        setShowSymbols(!showSymbols)
      }
      // Ctrl+A: AI Tools
      else if (e.ctrlKey && e.key === "a") {
        e.preventDefault()
        if (isPremium) {
          setShowAITools(true)
        } else {
          setShowPremiumPrompt(true)
        }
      }
      // Ctrl+O: Open Notebook
      else if (e.ctrlKey && e.key === "o") {
        e.preventDefault()
        setShowNotebooks(true)
      }
      // Ctrl+E: Export
      else if (e.ctrlKey && e.key === "e") {
        e.preventDefault()
        setShowExporter(true)
      }
      // Escape: Go back to home
      else if (e.key === "Escape") {
        router.push("/home")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, showSymbols, showAITools, showNotebooks, showExporter])

  const insertSymbol = (symbol: string) => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const newContent = content.substring(0, start) + symbol + content.substring(end)

    setContent(newContent)

    // Set cursor position after the inserted symbol
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + symbol.length
        textareaRef.current.selectionEnd = start + symbol.length
        textareaRef.current.focus()
      }
    }, 0)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
    }
    setNewTag("")
    setShowTagInput(false)
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Escape") {
      e.preventDefault()
      setShowTagInput(false)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Notebook:</span>
            <button
              className="font-medium text-gray-800 hover:underline focus:outline-none"
              onClick={() => setShowNotebooks(true)}
            >
              {notebook}
            </button>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {autoSaveStatus === "saving" && <span>Saving...</span>}
            {autoSaveStatus === "saved" && <span>Saved</span>}
            {autoSaveStatus === "error" && <span className="text-gray-700">Error saving</span>}
          </div>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full bg-transparent font-serif text-xl font-medium text-gray-800 focus:outline-none"
          placeholder="Note Title"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center rounded-md bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
              <span>{tag}</span>
              <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => removeTag(tag)}>
                &times;
              </button>
            </div>
          ))}
          {showTagInput ? (
            <input
              ref={tagInputRef}
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onBlur={addTag}
              onKeyDown={handleTagKeyDown}
              className="w-24 rounded-md border-none bg-gray-100 px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Add tag..."
            />
          ) : (
            <button
              className="rounded-md px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-200"
              onClick={() => setShowTagInput(true)}
            >
              + Add Tag
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Writing Area */}
        <div className="flex-1 overflow-auto p-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full w-full resize-none bg-transparent font-mono text-lg leading-relaxed text-gray-800 focus:outline-none"
            placeholder="Start taking notes..."
          />
        </div>

        {/* Feature Panel */}
        <FeaturePanel features={noteFeatures} mode="Note" />
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
            onClick={() => setShowSymbols(true)}
          >
            <Calculator className="h-4 w-4" />
            <span>Ctrl+M Symbols</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() => isPremium ? setShowAITools(true) : setShowPremiumPrompt(true)}
          >
            <Sparkles className="h-4 w-4" />
            <span>Ctrl+A AI Tools</span>
            {!isPremium && <Lock className="ml-1 h-3 w-3 text-amber-500" />}
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
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() => setShowExporter(true)}
          >
            <FileOutput className="h-4 w-4" />
            <span>Ctrl+E Export</span>
          </Button>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>

      {/* Symbol Picker Dialog */}
      <Dialog open={showSymbols} onOpenChange={setShowSymbols}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Symbol Picker</DialogTitle>
          </DialogHeader>
          <SymbolPicker onSelectSymbol={insertSymbol} />
        </DialogContent>
      </Dialog>

      {/* AI Tools Dialog */}
      <Dialog open={showAITools} onOpenChange={setShowAITools}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI Study Tools</DialogTitle>
          </DialogHeader>
          <AIStudyTools
            currentText={content}
            onInsertText={(text) => {
              setContent(content + text)
              setShowAITools(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Notebook Selector Dialog */}
      <Dialog open={showNotebooks} onOpenChange={setShowNotebooks}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Notebook</DialogTitle>
          </DialogHeader>
          <NotebookSelector
            currentNotebook={notebook}
            onSelectNotebook={(selected) => {
              setNotebook(selected)
              setShowNotebooks(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Note Exporter Dialog */}
      <Dialog open={showExporter} onOpenChange={setShowExporter}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Note</DialogTitle>
          </DialogHeader>
          <NoteExporter title={title} notebook={notebook} tags={tags} />
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
              AI Study Tools require a premium subscription
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-gradient-to-r from-amber-50 to-amber-100 p-4 border border-amber-200">
              <h4 className="font-medium mb-2 text-amber-800">Upgrade to Premium</h4>
              <p className="text-xs text-amber-700 mb-3">Unlock advanced AI study features including:</p>
              <ul className="text-xs text-amber-700 space-y-1 mb-3">
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> AI-powered note summarization</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> Concept explanation assistant</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> Automatic flashcard generation</li>
                <li className="flex items-center"><Check className="h-3 w-3 mr-1" /> Smart note restructuring</li>
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
                setShowAITools(true);
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
