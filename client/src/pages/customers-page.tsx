import { MainLayout } from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  lastPurchase: string;
  totalSpent: number;
  avatar?: string;
}

const customers: Customer[] = [
  {
    id: 1,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 234 567 8901",
    status: "active",
    lastPurchase: "2024-02-15",
    totalSpent: 1249.99,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  // Add more customers as needed
];

export default function CustomersPage() {
  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <div className="grid gap-6">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>
                        {customer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{customer.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {customer.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {customer.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                    {customer.status}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>Last Purchase: {customer.lastPurchase}</span>
                  <span className="font-semibold">Total Spent: ${customer.totalSpent}</span>
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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CustomersPage2() {
  const customers = [
    { name: "John Doe", email: "john@example.com", status: "Active", orders: 5 },
    { name: "Jane Smith", email: "jane@example.com", status: "Active", orders: 3 },
    { name: "Bob Wilson", email: "bob@example.com", status: "Inactive", orders: 1 },
  ];

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-8" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer, i) => (
                  <TableRow key={i}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.status}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}