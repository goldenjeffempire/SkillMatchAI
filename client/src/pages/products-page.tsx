import { MainLayout } from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageOpen, ShoppingCart, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "AI Content Generator Pro",
    description: "Generate high-quality content with advanced AI capabilities",
    price: 49.99,
    rating: 4.5,
    category: "AI Tools"
  },
  {
    id: 2,
    name: "Website Builder Template Pack",
    description: "Premium templates for building stunning websites",
    price: 29.99,
    rating: 4.8,
    category: "Templates"
  },
  // Add more products as needed
];

export default function ProductsPage() {
  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <Button>
            <PackageOpen className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{product.name}</span>
                  <Badge variant="outline">{product.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${product.price}</span>
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProductsPageDashboard() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-8" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">Product {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-40 rounded-md bg-muted" />
                  <p className="text-sm text-muted-foreground">
                    Product description goes here...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">$99.99</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}