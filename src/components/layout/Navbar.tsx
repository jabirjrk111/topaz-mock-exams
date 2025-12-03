import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-topaz">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-xl font-bold text-foreground">Topaz</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {user.role}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="default" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {user.role}
                </span>
              </div>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
