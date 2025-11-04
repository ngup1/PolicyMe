// Header component
// Navigation buttons will control content display on main page
import { Badge } from "../ui/badge";
const trendingIssues = [ //will change this to mock data, once we get backend and front-end connected
  "Healthcare Reform",
  "Climate Policy",
  "Tax Legislation",
  "Education Funding",
  "Immigration Policy",
];



export default function Header() {
   return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Policy<span className="text-accent">ME</span>
          </h1>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-accent transition-colors">Home</a>
            <a href="#" className="hover:text-accent transition-colors">Browse</a>
            <a href="#" className="hover:text-accent transition-colors">Archive</a>
          </nav>
        </div>
        
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-editorial-gray">
              Trending Issues
            </span>
            <div className="h-px flex-1 bg-border"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingIssues.map((issue) => (
              <Badge
                key={issue}
                variant="outline"
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
              >
                {issue}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

