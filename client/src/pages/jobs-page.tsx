import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, MapPin, Clock, Filter, Plus } from "lucide-react";
import { useState } from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <DashboardLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
            <p className="text-muted-foreground">Find and post job opportunities</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Type</label>
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                    options={[
                      { label: "All Types", value: "" },
                      { label: "Full-time", value: "full-time" },
                      { label: "Part-time", value: "part-time" },
                      { label: "Contract", value: "contract" },
                      { label: "Remote", value: "remote" }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                    options={[
                      { label: "All Locations", value: "" },
                      { label: "United States", value: "us" },
                      { label: "Europe", value: "eu" },
                      { label: "Asia", value: "asia" },
                      { label: "Remote", value: "remote" }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search jobs..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((job) => (
                <Card key={job} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-1">Senior Software Engineer</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            Tech Corp
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Remote
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Posted 2d ago
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">Full-time</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      We are seeking an experienced software engineer to join our growing team...
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">$120k - $150k</div>
                      <Button variant="outline">Apply Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}