import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "./dialog";
import { Button } from "./button";
import { Bookmark, Highlighter, X, ChevronLeft, ChevronRight } from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from './card';


interface BookReaderProps {
  book: any;
  isOpen: boolean;
  onClose: () => void;
}

export function BookReader({ book, isOpen, onClose }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [highlights, setHighlights] = useState<Array<{
    text: string;
    color: string;
    pageNumber: number;
  }>>([]);
  const [bookmarks, setBookmarks] = useState<Array<{
    pageNumber: number;
    note?: string;
  }>>([]);
  const [selectedText, setSelectedText] = useState("");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("yellow");

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        setSelectedText(selection.toString());
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleHighlight = (text: string, color: string = currentColor) => {
    setHighlights(prev => [...prev, {
      text,
      color,
      pageNumber: currentPage
    }]);
  };

  const handleBookmark = (note?: string) => {
    setBookmarks(prev => [...prev, {
      pageNumber: currentPage,
      note
    }]);
  };

  const removeHighlight = (text: string) => {
    setHighlights(prev => prev.filter(h => h.text !== text));
  };

  const removeBookmark = (pageNumber: number) => {
    setBookmarks(prev => prev.filter(b => b.pageNumber !== pageNumber));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
    >
      <div className="container h-full py-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex gap-4">
          {/* Book content */}
          <div className="flex-1 bg-card rounded-lg p-6 overflow-y-auto">
            <div className="prose prose-invert max-w-none">
              {book.content}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-64 space-y-4">
            {/* Page navigation */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>Page {currentPage}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleBookmark()}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add Bookmark
                </Button>

                {selectedText && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleHighlight(selectedText)}
                  >
                    <Highlighter className="h-4 w-4 mr-2" />
                    Highlight Selection
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Bookmarks */}
            <Card>
              <CardHeader>
                <CardTitle>Bookmarks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {bookmarks.map((bookmark, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between"
                  >
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentPage(bookmark.pageNumber)}
                    >
                      Page {bookmark.pageNumber}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeBookmark(bookmark.pageNumber)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {highlights.map((highlight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between"
                  >
                    <div 
                      className="text-sm truncate flex-1"
                      style={{ backgroundColor: highlight.color + '40' }}
                    >
                      {highlight.text}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeHighlight(highlight.text)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}