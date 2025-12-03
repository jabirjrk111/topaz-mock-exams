import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTests } from '@/contexts/TestContext';
import { useToast } from '@/hooks/use-toast';
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function TakeTest() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getTestById, submitAttempt } = useTests();
  const navigate = useNavigate();
  const { toast } = useToast();

  const test = id ? getTestById(id) : undefined;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (!test) {
      navigate('/dashboard');
    } else {
      setTimeLeft(test.duration * 60);
    }
  }, [user, test, navigate]);

  const handleSubmit = useCallback(() => {
    if (!test || !user || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Calculate score
    let score = 0;
    test.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    submitAttempt({
      testId: test.id,
      userId: user.id,
      answers,
      score,
      totalQuestions: test.questions.length,
      completedAt: new Date(),
      timeTaken: (test.duration * 60) - timeLeft,
    });

    navigate(`/results/${test.id}`, { state: { answers, score } });
  }, [test, user, answers, timeLeft, submitAttempt, navigate, isSubmitting]);

  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, handleSubmit]);

  if (!test || !user) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const question = test.questions[currentQuestion];
  const progress = (Object.keys(answers).length / test.questions.length) * 100;

  if (!hasStarted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-topaz">
            <span className="text-2xl font-bold text-primary-foreground">T</span>
          </div>
          
          <h1 className="mb-2 text-2xl font-bold text-foreground">{test.title}</h1>
          <p className="mb-6 text-muted-foreground">{test.description}</p>
          
          <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg bg-secondary/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="text-xl font-semibold text-foreground">{test.questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-xl font-semibold text-foreground">{test.duration} min</p>
            </div>
          </div>
          
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Instructions</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Read each question carefully before answering</li>
                  <li>• You can navigate between questions</li>
                  <li>• The test will auto-submit when time runs out</li>
                  <li>• Results will be shown immediately after submission</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
              Go Back
            </Button>
            <Button className="flex-1" onClick={() => setHasStarted(true)}>
              Start Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-semibold text-foreground">{test.title}</h1>
          
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-foreground'
          }`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-gradient-topaz transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        <div className="container mx-auto flex flex-1 flex-col px-4 py-8">
          {/* Question Navigator */}
          <div className="mb-6 flex flex-wrap gap-2">
            {test.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  index === currentQuestion
                    ? 'bg-primary text-primary-foreground'
                    : answers[q.id] !== undefined
                    ? 'bg-success/20 text-success'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="flex-1">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <p className="mb-2 text-sm font-medium text-primary">
                Question {currentQuestion + 1} of {test.questions.length}
              </p>
              <h2 className="mb-6 text-xl font-semibold text-foreground md:text-2xl">
                {question.text}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setAnswers({ ...answers, [question.id]: index })}
                    className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                      answers[question.id] === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      answers[question.id] === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-foreground">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            {currentQuestion === test.questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion((prev) => Math.min(test.questions.length - 1, prev + 1))}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
