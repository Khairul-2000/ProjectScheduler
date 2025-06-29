'use client';

import { useState } from 'react';
import ProjectForm from '@/components/ProjectForm';
import ProjectResults from '@/components/ProjectResults';
import ProjectHistory from '@/components/ProjectHistory';

interface ProjectFormData {
  project_type: string;
  objectives: string;
  industry: string;
  team_members: string[];
  requirements: string[];
}

interface ProjectResponse {
  id?: string;
  plan: string;
  schedule: string;
  review: string;
  html_output: string;
  created_at?: string;
}

type ViewMode = 'history' | 'form' | 'results';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProjectResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('history');

  const handleSubmit = async (formData: ProjectFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://0.0.0.0:8000/generate-project-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProjectResponse = await response.json();
      setResults(data);
      setViewMode('results');
    } catch (err) {
      console.error('Error generating project plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate project plan');
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    setResults(null);
    setError(null);
    setViewMode('form');
  };

  const handleViewHistory = () => {
    setResults(null);
    setError(null);
    setViewMode('history');
  };

  const handleViewProject = (projectData: ProjectResponse) => {
    setResults(projectData);
    setViewMode('results');
  };

  const renderNavigation = () => (
    <div className="text-center space-y-4 mb-8">
      <h1 className="text-4xl font-bold text-gray-900">
        AI Project Management System
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Generate comprehensive project plans, schedules, and reviews using AI-powered workflows with MongoDB persistence
      </p>
      
      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleViewHistory}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'history'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Project History
        </button>
        <button
          onClick={handleNewProject}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'form'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Create New Project
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {viewMode !== 'results' && renderNavigation()}
        
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                    {error.includes('Failed to fetch') && (
                      <p className="mt-1">
                        Make sure the backend server is running on http://localhost:8000 and MongoDB is connected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === 'history' && (
          <ProjectHistory onViewProject={handleViewProject} onNewProject={handleNewProject} />
        )}
        
        {viewMode === 'form' && (
          <ProjectForm onSubmit={handleSubmit} loading={loading} />
        )}
        
        {viewMode === 'results' && results && (
          <ProjectResults results={results} onNewProject={handleNewProject} />
        )}
      </div>
    </main>
  );
}
