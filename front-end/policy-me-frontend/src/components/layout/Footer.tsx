import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00132B' }}>
                <BookOpen className="w-5 h-5" style={{ color: '#DFE4EA' }} />
              </div>
              <span className="text-lg font-semibold" style={{ color: '#00132B' }}>
                Open Politic
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making policy accessible and understandable for everyone.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Explore', links: ['Browse Policies', 'Trending Topics', 'Recent Legislation'] },
            { title: 'Resources', links: ['How It Works', 'FAQ', 'API Access'] },
            { title: 'Company', links: ['About Us', 'Contact', 'Privacy Policy'] }
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-foreground transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Open Politic. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
