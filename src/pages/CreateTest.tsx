import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useTests } from '@/contexts/TestContext';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/types';
import { Plus, Trash2, GripVertical, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateTest() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const { user } = useAuth();
  const { addTest, updateTest, getTestById } = useTests();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/auth');
      return;
    }

    if (isEditing) {
      const test = getTestById(id);
      if (test) {
        setTitle(test.title);
        setDescription(test.description);
        setDuration(test.duration);
        setQuestions(test.questions);
        setIsPublished(test.isPublished);
      } else {
        navigate('/admin');
      }
    }
  }, [user, id, isEditing, getTestById, navigate]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Please enter a test title', variant: 'destructive' });
      return;
    }

    if (questions.length === 0) {
      toast({ title: 'Error', description: 'Please add at least one question', variant: 'destructive' });
      return;
    }

    const hasEmptyQuestions = questions.some(
      q => !q.text.trim() || q.options.some(o => !o.trim())
    );

    if (hasEmptyQuestions) {
      toast({ title: 'Error', description: 'Please fill in all questions and options', variant: 'destructive' });
      return;
    }

    if (isEditing) {
      updateTest(id!, {
        title,
        description,
        duration,
        questions,
        isPublished,
      });
      toast({ title: 'Test updated', description: 'Your changes have been saved.' });
    } else {
      addTest({
        title,
        description,
        duration,
        questions,
        createdBy: user!.id,
        isPublished,
      });
      toast({ title: 'Test created', description: 'Your new test has been created successfully.' });
    }

    navigate('/admin');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isEditing ? 'Edit Test' : 'Create New Test'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? 'Update your test details and questions' : 'Set up your test with questions and answers'}
                </p>
              </div>
            </div>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Save Changes' : 'Create Test'}
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Test Details */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Test Details</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Mathematics Chapter 1"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the test..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={5}
                      max={180}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                    <div>
                      <p className="font-medium text-foreground">Publish Test</p>
                      <p className="text-sm text-muted-foreground">Make visible to students</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-muted after:bg-card after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm font-medium text-foreground">Summary</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>Questions: {questions.length}</p>
                    <p>Duration: {duration} minutes</p>
                    <p>Status: {isPublished ? 'Published' : 'Draft'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                    <p className="mb-4 text-muted-foreground">No questions added yet</p>
                    <Button onClick={addQuestion}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Question
                    </Button>
                  </div>
                ) : (
                  questions.map((question, qIndex) => (
                    <div
                      key={question.id}
                      className="rounded-xl border border-border bg-card p-6"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {qIndex + 1}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Textarea
                            placeholder="Enter your question..."
                            value={question.text}
                            onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Options (select the correct answer)</Label>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuestion(qIndex, { correctAnswer: oIndex })}
                                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all ${
                                    question.correctAnswer === oIndex
                                      ? 'bg-success text-success-foreground'
                                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                  }`}
                                >
                                  {String.fromCharCode(65 + oIndex)}
                                </button>
                                <Input
                                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  value={option}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  className={question.correctAnswer === oIndex ? 'border-success' : ''}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Explanation (optional)</Label>
                          <Input
                            placeholder="Why is this the correct answer?"
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {questions.length > 0 && (
                  <Button variant="outline" onClick={addQuestion} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
