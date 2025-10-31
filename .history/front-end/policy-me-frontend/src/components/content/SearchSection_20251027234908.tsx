import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui";

export const SearchSection = () => {
  return (
    <section className="bg-editorial-light border-b border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Understand Policy, Simplified
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Search for any policy or issue and get clear, personalized insights
          </p>
          
          <div className="flex gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search policies or issues..."
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};