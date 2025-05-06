import { motion } from "framer-motion";
import { 
  TrendingUp, Lightbulb, Users, CalendarDays, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LibraryPreviewSection() {
  const categories = [
    {
      name: "Business Growth",
      icon: <TrendingUp className="h-5 w-5 mr-3 text-primary-foreground" />,
      count: "86 books"
    },
    {
      name: "Personal Development",
      icon: <Lightbulb className="h-5 w-5 mr-3 text-primary-foreground" />,
      count: "123 books"
    },
    {
      name: "Parenting & Family",
      icon: <Users className="h-5 w-5 mr-3 text-primary-foreground" />,
      count: "57 books"
    },
    {
      name: "Kids & Learning",
      icon: <CalendarDays className="h-5 w-5 mr-3 text-primary-foreground" />,
      count: "92 books"
    },
    {
      name: "Productivity",
      icon: <Clock className="h-5 w-5 mr-3 text-primary-foreground" />,
      count: "74 books"
    }
  ];

  const books = [
    {
      title: "The Growth Mindset: Strategies for Business Success",
      category: "Business Growth",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200",
      rating: 4.2,
      readTime: "15 min read"
    },
    {
      title: "Space Adventures: A Journey Through the Universe",
      category: "Kids & Learning",
      cover: "https://pixabay.com/get/g7a87ef098db58ed6dee3d9ce206aa2de43e2b81d9abe3e5e753c9787edeb2b266bbebc64517e7ee27555628710583fb51176c8fab5dab32ea0d4b73dd5fa5b32_1280.jpg",
      rating: 4.8,
      readTime: "10 min read"
    }
  ];

  return (
    <section id="library" className="py-20 px-4 bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="text-accent font-medium mb-3">KNOWLEDGE BASE</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Books & Growth Library</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access a vast collection of growth books for all ages with AI-generated summaries and recommendations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Library Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-6">Browse Categories</h3>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="flex items-center justify-between bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="flex items-center">
                    {category.icon}
                    {category.name}
                  </span>
                  <span className="text-gray-500 text-sm">{category.count}</span>
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Featured Books */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Featured Books</h3>
              <a href="#" className="text-primary-foreground hover:text-white text-sm font-medium">View All</a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map((book, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900 rounded-xl overflow-hidden card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-xs text-primary-foreground font-medium mb-1">{book.category}</div>
                      <h4 className="text-lg font-bold">{book.title}</h4>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${i < Math.floor(book.rating) ? "text-yellow-400" : "text-gray-400"}`} 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{book.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">{book.readTime}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="secondary" className="flex-1 py-2 text-sm bg-primary/20 hover:bg-primary/30 rounded-lg">
                        Read
                      </Button>
                      <Button className="flex-1 py-2 text-sm bg-primary rounded-lg hover:bg-primary-dark">
                        Get Summary
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
