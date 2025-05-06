
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "./dialog";
import { Button } from "./button";
import { Bookmark, Highlighter } from "lucide-react";

interface BookReaderProps {
  book: any;
  isOpen: boolean;
  onClose: () => void;
}

export function BookReader({ book, isOpen, onClose }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const handleHighlight = (text: string) => {
    setHighlights(prev => [...prev, text]);
  };

  const handleBookmark = (page: number) => {
    setBookmarks(prev => [...prev, page]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <motion.div 
          className="relative h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute top-4 right-4 space-x-2">
            <Button onClick={() => handleBookmark(currentPage)}>
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmark
            </Button>
            <Button onClick={() => handleHighlight(window.getSelection()?.toString() || "")}>
              <Highlighter className="w-4 h-4 mr-2" />
              Highlight
            </Button>
          </div>
          
          <div className="p-8 prose prose-lg max-w-none">
            {book.content}
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 space-x-4">
            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
              Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button onClick={() => setCurrentPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
