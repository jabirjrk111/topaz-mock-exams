import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTests } from '@/contexts/TestContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, FileText, Users, Clock, MoreVertical, Edit, Trash2, 
  Eye, EyeOff, CheckCircle2, BarChart3 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { tests, attempts, deleteTest, updateTest } = useTests();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const totalAttempts = attempts.length;
  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length)
    : 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteTest(deleteId);
      toast({ title: 'Test deleted', description: 'The test has been removed successfully.' });
      setDeleteId(null);
    }
  };

  const togglePublish = (testId: string, currentStatus: boolean) => {
    updateTest(testId, { isPublished: !currentStatus });
    toast({
      title: currentStatus ? 'Test unpublished' : 'Test published',
      description: currentStatus ? 'Students can no longer see this test.' : 'Students can now take this test.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="mt-1 text-muted-foreground">Manage tests and monitor student progress</p>
            </div>
            <Link to="/admin/create-test">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Test
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold text-foreground">{tests.length}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tests.filter(t => t.isPublished).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Test Attempts</p>
                  <p className="text-2xl font-bold text-foreground">{totalAttempts}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-topaz/10">
                  <BarChart3 className="h-6 w-6 text-topaz" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Score</p>
                  <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tests List */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">All Tests</h2>
            
            {tests.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground">No Tests Yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Create your first test to get started.
                </p>
                <Link to="/admin/create-test" className="mt-4 inline-block">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Test
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-secondary/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Test</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Questions</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Duration</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Attempts</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {tests.map((test) => {
                        const testAttempts = attempts.filter(a => a.testId === test.id).length;
                        
                        return (
                          <tr key={test.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-foreground">{test.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {test.description}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-foreground">{test.questions.length}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{test.duration} min</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-foreground">{testAttempts}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                test.isPublished 
                                  ? 'bg-success/10 text-success' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {test.isPublished ? (
                                  <>
                                    <Eye className="h-3 w-3" />
                                    Published
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3" />
                                    Draft
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate(`/admin/edit-test/${test.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => togglePublish(test.id, test.isPublished)}>
                                    {test.isPublished ? (
                                      <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Publish
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => setDeleteId(test.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
