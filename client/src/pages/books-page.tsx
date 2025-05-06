
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
    author: ""
  });

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
          {/* Add more filters */}
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
