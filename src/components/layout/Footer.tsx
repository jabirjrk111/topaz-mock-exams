import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-topaz">
              <span className="text-sm font-bold text-primary-foreground">T</span>
            </div>
            <span className="font-semibold text-foreground">Topaz</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/auth?mode=signup" className="hover:text-foreground transition-colors">Sign Up</Link>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Topaz EdTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
