"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileText, Download, Share2, Printer } from "lucide-react"

interface NoteExporterProps {
  title: string
  notebook: string
  tags: string[]
}

export default function NoteExporter({ title, notebook, tags }: NoteExporterProps) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeTags, setIncludeTags] = useState(true)
  const [includeNotebook, setIncludeNotebook] = useState(true)
  const [includeTimestamp, setIncludeTimestamp] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const exportNote = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      // In a real app, this would trigger a download
      alert(`Note "${title}" exported as ${exportFormat.toUpperCase()}`)
    }, 1500)
  }

  return (
    <Tabs defaultValue="export">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="export">
          <Download className="mr-2 h-4 w-4" />
          Export
        </TabsTrigger>
        <TabsTrigger value="print">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </TabsTrigger>
        <TabsTrigger value="share">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </TabsTrigger>
      </TabsList>

      <TabsContent value="export" className="space-y-4 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="docx">Word Document</SelectItem>
                <SelectItem value="txt">Plain Text</SelectItem>
                <SelectItem value="md">Markdown</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 rounded-md border border-gray-200 p-3">
            <h3 className="text-sm font-medium text-gray-700">Export Options</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="include-tags">Include Tags</Label>
                <p className="text-xs text-gray-500">Add tags as metadata to the exported file</p>
              </div>
              <Switch id="include-tags" checked={includeTags} onCheckedChange={setIncludeTags} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="include-notebook">Include Notebook</Label>
                <p className="text-xs text-gray-500">Add notebook name to the exported file</p>
              </div>
              <Switch id="include-notebook" checked={includeNotebook} onCheckedChange={setIncludeNotebook} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="include-timestamp">Include Timestamp</Label>
                <p className="text-xs text-gray-500">Add creation and modification dates</p>
              </div>
              <Switch id="include-timestamp" checked={includeTimestamp} onCheckedChange={setIncludeTimestamp} />
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <h3 className="text-sm font-medium text-gray-700">Export Preview</h3>
            <div className="mt-2 rounded-md border border-gray-200 bg-white p-3">
              <p className="font-medium text-gray-800">{title}</p>
              {includeNotebook && <p className="mt-1 text-sm text-gray-600">Notebook: {notebook}</p>}
              {includeTags && tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {includeTimestamp && (
                <p className="mt-2 text-xs text-gray-500">
                  Created: {new Date().toLocaleDateString()} | Modified: {new Date().toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button onClick={exportNote} disabled={isExporting} className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
        </Button>
      </TabsContent>

      <TabsContent value="print" className="space-y-4 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Print Options</Label>
            <div className="space-y-4 rounded-md border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="print-header">Include Header</Label>
                  <p className="text-xs text-gray-500">Add title and notebook name at the top</p>
                </div>
                <Switch id="print-header" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="print-footer">Include Footer</Label>
                  <p className="text-xs text-gray-500">Add page numbers and date at the bottom</p>
                </div>
                <Switch id="print-footer" defaultChecked />
              </div>
            </div>
          </div>

          <Button className="w-full">
            <Printer className="mr-2 h-4 w-4" />
            Print Note
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="share" className="space-y-4 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Share Options</Label>
            <div className="space-y-4 rounded-md border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Copy as Plain Text
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via Email
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <h3 className="text-sm font-medium text-gray-700">Generate Shareable Link</h3>
            <p className="mt-1 text-xs text-gray-500">
              Create a link that allows others to view this note (requires cloud sync)
            </p>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Generate Link
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
