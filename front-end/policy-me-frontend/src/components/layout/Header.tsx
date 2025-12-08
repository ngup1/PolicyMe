'use client';
import { useRouter } from 'next/navigation';
import { Badge } from "../ui/badge";
import { useAuth } from '@/context/AuthProvider';
import { Button } from '../ui/Button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen } from 'lucide-react';

const trendingIssues = [
  "Healthcare Reform",
  "Climate Policy",
  "Tax Legislation",
  "Education Funding",
  "Immigration Policy",
];

export default function Header() {
  const router = useRouter();
  const { user, logOut, formatDate } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => router.push('/')}
          >
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105" 
              style={{ backgroundColor: '#00132B' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: '#DFE4EA' }} />
            </div>
            <span className="text-lg font-semibold" style={{ color: '#00132B' }}>
              Open Politic
            </span>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">Welcome, {user.firstName}</Button>
                </HoverCardTrigger>

                <HoverCardContent className="w-80">
                  <div className="flex flex-col gap-2 items-center">
                    <Avatar>
                      <AvatarImage src={user.profilePicture} alt={user.firstName} />
                      <AvatarFallback>
                        {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <p className="text-sm font-semibold">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Member since: {formatDate(user.createdDate)}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/demographics")}
                      >
                        Edit Profile
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => logOut()}>
                        Log Out
                      </Button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => router.push('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => router.push('/signup')}
                  style={{ backgroundColor: '#00132B' }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Trending */}
        <div className="flex items-center gap-3 pb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Trending
          </span>
          <div className="flex flex-wrap gap-2">
            {trendingIssues.map((issue) => (
              <Badge
                key={issue}
                variant="secondary"
                className="cursor-pointer text-xs font-normal hover:bg-muted/80 transition-colors"
                onClick={() => router.push(`/?search=${encodeURIComponent(issue)}`)}
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
