
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Book, Search } from "lucide-react";
import { useState } from "react";

export default function BooksPage() {
  const [filters, setFilters] = useState({
    category: "",
    age: "",
    genre: "",
    author: "",
    rating: 0,
    readingTime: "" as "short" | "medium" | "long" | "",
    language: "",
    format: "" as "ebook" | "audio" | "pdf" | "",
    difficulty: "" as "beginner" | "intermediate" | "advanced" | "",
    progress: "" as "not-started" | "in-progress" | "completed" | "",
    favorite: false,
    hasHighlights: false,
  });

  const filterOptions = {
    ages: ["0-5", "6-8", "9-12", "13-17", "18+"],
    genres: ["Fiction", "Non-Fiction", "Business", "Self-Help", "Education", "Parenting"],
    formats: ["ebook", "audio", "pdf"],
    difficulties: ["beginner", "intermediate", "advanced"],
    readingTimes: ["short", "medium", "long"],
  };

  const { data: books, isLoading } = useQuery({
    queryKey: ['books', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const res = await fetch(`/api/books?${params}`);
      return res.json();
    }
  });

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Books Library</h1>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search books..."
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
          <div className="flex gap-4 flex-wrap">
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(f => ({ ...f, category: value }))}
              options={[
                { label: "All Categories", value: "" },
                { label: "Growth", value: "growth" },
                { label: "Success", value: "success" },
                { label: "Parenting", value: "parenting" },
                { label: "Kids", value: "kids" }
              ]}
            />
            <Select
              value={filters.progress}
              onValueChange={(value) => setFilters(f => ({ ...f, progress: value as typeof f.progress }))}
              options={[
                { label: "All Progress", value: "" },
                { label: "Not Started", value: "not-started" },
                { label: "In Progress", value: "in-progress" },
                { label: "Completed", value: "completed" }
              ]}
            />
            <Select
              value={filters.readingTime}
              onValueChange={(value) => setFilters(f => ({ ...f, readingTime: value as typeof f.readingTime }))}
              options={[
                { label: "Any Length", value: "" },
                { label: "Short (<30 min)", value: "short" },
                { label: "Medium (30-60 min)", value: "medium" },
                { label: "Long (>60 min)", value: "long" }
              ]}
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={filters.favorite}
                onCheckedChange={(checked) => setFilters(f => ({ ...f, favorite: checked }))}
                id="favorite-filter"
              />
              <Label htmlFor="favorite-filter">Favorites</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={filters.hasHighlights}
                onCheckedChange={(checked) => setFilters(f => ({ ...f, hasHighlights: checked }))}
                id="highlights-filter"
              />
              <Label htmlFor="highlights-filter">With Highlights</Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {books?.map((book: any) => (
            <Card key={book.id} className="p-4">
              <div className="aspect-[3/4] relative mb-4 bg-muted rounded-lg">
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="object-cover rounded-lg"
                  />
                )}
              </div>
              <h3 className="font-medium line-clamp-2">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
