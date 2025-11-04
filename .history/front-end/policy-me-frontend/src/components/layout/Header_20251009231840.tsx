import { Badge } from "../ui/badge";

const trendingIssues = [
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
        {/* Logo + Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6">
          {/* Logo */}
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 md:mb-0">
            Policy<span className="text-accent">ME</span>
          </h1>

          {/* Navigation */}
          <nav className="md:ml-auto">
            <ul className="flex flex-wrap gap-4 text-sm font-medium">
              {['Home', 'Browse', 'Archive'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Trending Issues */}
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Trending Issues
            </span>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <div className="flex flex-wrap gap-2">
            {trendingIssues.map((issue) => (
              <Badge
                key={issue}
                variant="outline"
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors transform hover:scale-105 animate__animated animate__fadeIn"
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
