
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
