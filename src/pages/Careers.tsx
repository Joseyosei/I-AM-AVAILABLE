import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Search, 
  Building2, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_range: string | null;
  created_at: string;
  description: string;
  skills: string[];
  apply_url: string | null;
}

const typeColors: Record<string, string> = {
  'fulltime': 'bg-primary/10 text-primary',
  'part-time': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'contract': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  'freelance': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const typeLabels: Record<string, string> = {
  'fulltime': 'Full-time',
  'part-time': 'Part-time',
  'contract': 'Contract',
  'freelance': 'Freelance',
};

export default function Careers() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (!error && data) setJobs(data);
      setLoadingJobs(false);
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || job.job_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleApply = () => {
    setApplyDialogOpen(false);
    toast({
      title: 'Application Sent!',
      description: `Your application for ${selectedJob?.title} at ${selectedJob?.company} has been submitted.`,
    });
    setSelectedJob(null);
  };

  return (
    <PublicLayout>
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Career <span className="text-gradient">Opportunities</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find your next role at companies that value transparency and authentic collaboration.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'fulltime', 'contract', 'freelance'].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                >
                  {type === 'all' ? 'All Types' : typeLabels[type] || type}
                </Button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {loadingJobs ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filtered.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedJob(job);
                    setApplyDialogOpen(true);
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-semibold">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-sm shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[job.job_type] || 'bg-secondary text-foreground'}`}>
                        {typeLabels[job.job_type] || job.job_type}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location || 'Remote'}
                      </div>
                      {job.salary_range && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary_range}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              at {selectedJob?.company} · {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="Your name" className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label>Cover Letter</Label>
              <Textarea placeholder="Tell them why you're a great fit..." className="mt-1" rows={4} />
            </div>
            <div>
              <Label>Resume Link</Label>
              <Input placeholder="https://..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>
              Submit Application <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
