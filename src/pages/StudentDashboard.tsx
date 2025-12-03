import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTests } from '@/contexts/TestContext';
import { Clock, FileText, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { tests, getAttemptsByUser } = useTests();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  if (!user) return null;

  const publishedTests = tests.filter(t => t.isPublished);
  const userAttempts = getAttemptsByUser(user.id);
  const completedTestIds = new Set(userAttempts.map(a => a.testId));
  
  const totalScore = userAttempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = userAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, <span className="text-gradient">{user.name}</span>!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Continue your learning journey. Here are your available tests.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tests Completed</p>
                  <p className="text-2xl font-bold text-foreground">{userAttempts.length}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                  <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Tests */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Available Tests</h2>
            
            {publishedTests.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground">No Tests Available</h3>
                <p className="mt-2 text-muted-foreground">
                  Check back later for new tests to practice.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publishedTests.map((test) => {
                  const isCompleted = completedTestIds.has(test.id);
                  const attempt = userAttempts.find(a => a.testId === test.id);
                  
                  return (
                    <div
                      key={test.id}
                      className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {test.title}
                        </h3>
                        {isCompleted && (
                          <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                            Completed
                          </span>
                        )}
                      </div>
                      
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {test.description}
                      </p>
                      
                      <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{test.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{test.duration} min</span>
                        </div>
                      </div>
                      
                      {isCompleted && attempt ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Score: <span className="font-semibold text-foreground">{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</span>
                          </span>
                          <Link to={`/test/${test.id}`}>
                            <Button variant="outline" size="sm">
                              Retake
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link to={`/test/${test.id}`}>
                          <Button className="w-full" size="sm">
                            Start Test
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
