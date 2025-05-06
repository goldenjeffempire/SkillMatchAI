
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, Download } from "lucide-react";
import { useState } from "react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: "template" | "plugin" | "ai-pack";
  price: number;
  downloads: number;
  rating: number;
  author: string;
  thumbnail?: string;
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");

  return (
    <DashboardLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Discover templates, plugins, and AI packs</p>
          </div>
          <Button>
            <Grid className="w-4 h-4 mr-2" />
            Submit Item
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search marketplace..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
            options={[
              { label: "All Types", value: "" },
              { label: "Templates", value: "template" },
              { label: "Plugins", value: "plugin" },
              { label: "AI Packs", value: "ai-pack" }
            ]}
          />
          <Select
            value={sortBy}
            onValueChange={setSortBy}
            options={[
              { label: "Most Popular", value: "popular" },
              { label: "Newest", value: "newest" },
              { label: "Price: Low to High", value: "price-asc" },
              { label: "Price: High to Low", value: "price-desc" }
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample marketplace items - replace with real data */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="group hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Sample Template {item}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A professional template for your needs
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">$29.99</span>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
