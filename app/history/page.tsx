"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, FileText, Book, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock history data
const historyEntries = [
  {
    id: 1,
    date: "03 Apr",
    type: "novel",
    title: 'Chapter 2 - "A Walk Alone"',
    wordCount: 1248,
    content: "The path stretched before him, winding through the forest like a ribbon of pale moonlight...",
  },
  {
    id: 2,
    date: "03 Apr",
    type: "note",
    title: 'Physics - "Thermodynamics"',
    wordCount: 684,
    content: "The first law of thermodynamics states that energy cannot be created or destroyed...",
  },
  {
    id: 3,
    date: "02 Apr",
    type: "free",
    title: "Free Write",
    wordCount: 1007,
    content: "Ideas come and go like clouds in a summer sky, sometimes dark and heavy...",
  },
  {
    id: 4,
    date: "01 Apr",
    type: "novel",
    title: 'Chapter 1 - "Beginnings"',
    wordCount: 1532,
    content: "It all started on a Tuesday. Not a remarkable Tuesday by any means...",
  },
  {
    id: 5,
    date: "01 Apr",
    type: "note",
    title: 'Mathematics - "Calculus Basics"',
    wordCount: 892,
    content:
      "The fundamental theorem of calculus establishes the relationship between differentiation and integration...",
  },
]

export default function HistoryScreen() {
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const router = useRouter()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "novel":
        return <Book className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      case "free":
        return <Pencil className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/home")} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-xl font-medium text-gray-800">History & Archive</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* History List */}
        <div className="w-full overflow-y-auto p-4 md:w-1/2">
          <div className="space-y-2">
            {historyEntries.map((entry) => (
              <div
                key={entry.id}
                className={`cursor-pointer rounded-md border p-3 transition-colors ${
                  selectedEntry === entry.id
                    ? "border-gray-400 bg-gray-200"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedEntry(entry.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(entry.type)}
                    <span className="font-medium text-gray-800">{entry.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{entry.date}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>{entry.wordCount} words</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>10:42 AM</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        {selectedEntry && (
          <div className="hidden border-l border-gray-200 bg-white p-6 md:block md:w-1/2">
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-medium text-gray-800">
                {historyEntries.find((e) => e.id === selectedEntry)?.title}
              </h2>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{historyEntries.find((e) => e.id === selectedEntry)?.date}</span>
                <span>{historyEntries.find((e) => e.id === selectedEntry)?.wordCount} words</span>
              </div>

              <div className="rounded-md bg-gray-50 p-4 font-serif text-gray-800">
                {historyEntries.find((e) => e.id === selectedEntry)?.content}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Restore
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
