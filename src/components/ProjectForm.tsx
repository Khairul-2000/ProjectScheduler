'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusIcon, TrashIcon } from 'lucide-react';

interface ProjectFormData {
  project_type: string;
  objectives: string;
  industry: string;
  team_members: string[];
  requirements: string[];
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  loading: boolean;
}

export default function ProjectForm({ onSubmit, loading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    project_type: '',
    objectives: '',
    industry: '',
    team_members: [''],
    requirements: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      team_members: formData.team_members.filter(member => member.trim() !== ''),
      requirements: formData.requirements.filter(req => req.trim() !== '')
    };
    onSubmit(cleanData);
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team_members: [...prev.team_members, '']
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.map((member, i) => i === index ? value : member)
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type</Label>
              <Input
                id="project_type"
                value={formData.project_type}
                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                placeholder="e.g., Website, Mobile App, Software"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g., Technology, Healthcare, Finance"
                required
              />
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <Label htmlFor="objectives">Project Objectives</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
              placeholder="Describe the main goals and objectives of your project"
              rows={3}
              required
            />
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Button type="button" onClick={addTeamMember} size="sm" variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {formData.team_members.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={member}
                    onChange={(e) => updateTeamMember(index, e.target.value)}
                    placeholder="e.g., John Doe (Project Manager)"
                    className="flex-1"
                  />
                  {formData.team_members.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      size="sm"
                      variant="outline"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Project Requirements</Label>
              <Button type="button" onClick={addRequirement} size="sm" variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="Describe a project requirement"
                    rows={2}
                    className="flex-1"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      size="sm"
                      variant="outline"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-32">
              {loading ? 'Generating...' : 'Generate Project Plan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}