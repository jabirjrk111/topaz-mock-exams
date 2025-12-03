import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookOpen, Award, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Extensive Test Library',
    description: 'Access a wide range of mock tests across multiple subjects and difficulty levels.',
  },
  {
    icon: Clock,
    title: 'Timed Assessments',
    description: 'Practice with real exam conditions using our timed test feature.',
  },
  {
    icon: CheckCircle,
    title: 'Instant Results',
    description: 'Get immediate feedback with detailed explanations for every answer.',
  },
  {
    icon: Award,
    title: 'Track Progress',
    description: 'Monitor your improvement with comprehensive performance analytics.',
  },
];

const stats = [
  { value: '10,000+', label: 'Students' },
  { value: '500+', label: 'Mock Tests' },
  { value: '95%', label: 'Success Rate' },
  { value: '24/7', label: 'Availability' },
];

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary-foreground animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-topaz-light opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Your path to academic excellence
              </div>
              
              <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl animate-slide-up">
                Master Your Exams with{' '}
                <span className="text-gradient">Topaz</span>
              </h1>
              
              <p className="mb-8 text-lg text-primary-foreground/70 md:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Practice with comprehensive mock tests, get instant feedback, and track your progress. Join thousands of students achieving their academic goals.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="heroOutline" size="xl" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-20 left-1/2 h-40 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="border-b border-border bg-card py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl font-bold text-gradient md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Everything You Need to Excel
              </h2>
              <p className="text-lg text-muted-foreground">
                Our platform provides all the tools and resources to help you prepare effectively for your exams.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-topaz text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-topaz py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                Ready to Begin Your Journey?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80">
                Join Topaz today and take the first step towards academic excellence. It's free to get started!
              </p>
              <Link to="/auth?mode=signup">
                <Button size="xl" className="bg-background text-foreground hover:bg-background/90">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
