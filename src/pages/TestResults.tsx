import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTests } from '@/contexts/TestContext';
import { CheckCircle2, XCircle, Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function TestResults() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTestById } = useTests();

  const test = id ? getTestById(id) : undefined;
  const { answers, score } = (location.state as { answers: Record<string, number>; score: number }) || {};

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (!test || !answers) {
      navigate('/dashboard');
    }
  }, [user, test, answers, navigate]);

  if (!test || !answers || !user) return null;

  const percentage = Math.round((score / test.questions.length) * 100);
  const isPassing = percentage >= 60;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="mb-8 text-center">
            <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
              isPassing ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {isPassing ? (
                <Trophy className="h-10 w-10 text-success" />
              ) : (
                <XCircle className="h-10 w-10 text-destructive" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {isPassing ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isPassing 
                ? 'You did great on this test!' 
                : "Don't worry, you can always retake the test."}
            </p>
          </div>

          {/* Score Card */}
          <div className="mx-auto mb-8 max-w-md rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Score</p>
            <div className={`my-2 text-5xl font-bold ${isPassing ? 'text-success' : 'text-destructive'}`}>
              {percentage}%
            </div>
            <p className="text-muted-foreground">
              {score} out of {test.questions.length} correct
            </p>
            
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all duration-500 ${
                  isPassing ? 'bg-success' : 'bg-destructive'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Link to={`/test/${test.id}`}>
              <Button>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Test
              </Button>
            </Link>
          </div>

          {/* Detailed Results */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Review Your Answers</h2>
            
            <div className="space-y-4">
              {test.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`rounded-xl border p-6 ${
                      isCorrect 
                        ? 'border-success/30 bg-success/5' 
                        : 'border-destructive/30 bg-destructive/5'
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                          {index + 1}
                        </span>
                        <h3 className="font-medium text-foreground">{question.text}</h3>
                      </div>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                      )}
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-3 rounded-lg p-3 ${
                            optIndex === question.correctAnswer
                              ? 'bg-success/10 text-success'
                              : optIndex === userAnswer && !isCorrect
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-secondary/50 text-muted-foreground'
                          }`}
                        >
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            optIndex === question.correctAnswer
                              ? 'bg-success text-success-foreground'
                              : optIndex === userAnswer && !isCorrect
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{option}</span>
                          {optIndex === question.correctAnswer && (
                            <span className="ml-auto text-xs font-medium">Correct Answer</span>
                          )}
                          {optIndex === userAnswer && !isCorrect && (
                            <span className="ml-auto text-xs font-medium">Your Answer</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                        <p className="text-sm font-medium text-foreground">Explanation:</p>
                        <p className="mt-1 text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
