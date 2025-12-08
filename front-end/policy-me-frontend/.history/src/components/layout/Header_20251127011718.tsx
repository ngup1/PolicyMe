'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from "../ui/badge";
import { useAuth } from '@/context/AuthProvider';
import { Card } from '../ui/card';
import { Button } from '../ui/Button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const trendingIssues = [
  "Healthcare Reform",
  "Climate Policy",
  "Tax Legislation",
  "Education Funding",
  "Immigration Policy",
];

export default function Header() {
  const router = useRouter();
  const { user, logOut, formatDate } = useAuth(); //pull from context api
  console.log("within header " + user);
  const handleNavigate = () => {
    router.push("/demographics");
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto py-3">
        {/* Logo + Welcome Text */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6">
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 md:mb-0">
            Policy<span className="text-red-700">Me</span>
          </h1>
          <HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">Welcome {user?.firstName}</Button>
  </HoverCardTrigger>

  <HoverCardContent className="w-80">
    <div className="flex flex-col gap-2 items-center">
      {/* Profile picture */}
      <Avatar>
        <AvatarImage src={user?.profilePicture} alt = {user?.firstName}/>
        <AvatarFallback> {user?.firstName?.[0] ?? "?"} </AvatarFallback>
      </Avatar>

      {/* Name */}
      <p className="text-sm font-semibold">
        {user?.firstName} {user?.lastName}
      </p>

      {/* Member since */}
      <p className="text-xs text-muted-foreground">
        Member since: {formatDate(user?.createdDate)}
      </p>

      {/* Action buttons */}
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