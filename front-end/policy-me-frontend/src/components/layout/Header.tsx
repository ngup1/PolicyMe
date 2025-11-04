// Header component
// Navigation buttons will control content display on main page
import { Badge } from "../ui/badge";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
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
    <div className="container mx-auto py-3">
      {/* Logo + Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6">
        <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 md:mb-0">
          Policy<span className="text-accent">ME</span>
        </h1>

        <div className="flex items-center gap-6">
          <nav>
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

          {/* Authentication Buttons */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
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

