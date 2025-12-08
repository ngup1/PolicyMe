// Footer component
'use client';

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Policy<span className="text-destructive">Summarizer</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Making policy accessible and understandable for everyone.
            </p>
          </div>



        </div>

      </div>
    </footer>
  );
}

