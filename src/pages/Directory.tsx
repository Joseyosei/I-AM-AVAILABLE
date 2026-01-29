import { useState, useMemo } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { mockProfiles } from '@/lib/mock-data';
import { FilterState, OpenToOption, OPEN_TO_LABELS, AvailabilityStatus } from '@/lib/types';
import { Search, SlidersHorizontal, X, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const initialFilters: FilterState = {
  search: '',
  availability: 'all',
  sortBy: 'featured',
  openTo: [],
};

export default function Directory() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.availability !== 'all') count++;
    if (filters.openTo.length > 0) count++;
    return count;
  }, [filters]);

  const filteredProfiles = useMemo(() => {
    let result = [...mockProfiles];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (profile) =>
          profile.name.toLowerCase().includes(searchLower) ||
          profile.role.toLowerCase().includes(searchLower) ||
          profile.location.toLowerCase().includes(searchLower) ||
          profile.skills.some((skill) => skill.toLowerCase().includes(searchLower))
      );
    }

    // Availability filter
    if (filters.availability !== 'all') {
      result = result.filter((profile) => profile.availability === filters.availability);
    }

    // Open To filter (OR logic)
    if (filters.openTo.length > 0) {
      result = result.filter((profile) =>
        filters.openTo.some((option) => profile.openTo.includes(option))
      );
    }

    // Sorting
    if (filters.sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      result.sort(
        (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      );
    }

    return result;
  }, [filters]);

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const toggleOpenTo = (option: OpenToOption) => {
    setFilters((prev) => ({
      ...prev,
      openTo: prev.openTo.includes(option)
        ? prev.openTo.filter((o) => o !== option)
        : [...prev.openTo, option],
    }));
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Name, role, skills..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <Label>Availability</Label>
        <Select
          value={filters.availability}
          onValueChange={(value) =>
            setFilters({ ...filters, availability: value as 'all' | AvailabilityStatus })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available Now</SelectItem>
            <SelectItem value="open">Open to Conversations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            setFilters({ ...filters, sortBy: value as 'featured' | 'recent' })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured First</SelectItem>
            <SelectItem value="recent">Recently Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Open To */}
      <div className="space-y-3">
        <Label>Open To</Label>
        <div className="space-y-2">
          {(Object.keys(OPEN_TO_LABELS) as OpenToOption[]).map((option) => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={option}
                checked={filters.openTo.includes(option)}
                onCheckedChange={() => toggleOpenTo(option)}
              />
              <label
                htmlFor={option}
                className="text-sm cursor-pointer"
              >
                {OPEN_TO_LABELS[option]}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <PublicLayout>
      <div className="py-8 md:py-12">
        <div className="container-wide">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Directory</h1>
            <p className="text-muted-foreground">
              Browse {mockProfiles.length} professionals ready to collaborate
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or skills..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-11 h-12"
              />
            </div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.availability !== 'all' && (
                <span className="filter-tag">
                  {filters.availability === 'available' ? 'Available Now' : 'Open to Chat'}
                  <button
                    onClick={() => setFilters({ ...filters, availability: 'all' })}
                    className="ml-1.5 hover:text-primary/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.openTo.map((option) => (
                <span key={option} className="filter-tag">
                  {OPEN_TO_LABELS[option]}
                  <button
                    onClick={() => toggleOpenTo(option)}
                    className="ml-1.5 hover:text-primary/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Results */}
          {filteredProfiles.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">No profiles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
