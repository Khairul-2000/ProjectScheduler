'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';

interface ProjectResponse {
  plan: string;
  schedule: string;
  review: string;
  html_output: string;
}

interface ProjectResultsProps {
  results: ProjectResponse;
  onNewProject: () => void;
}

export default function ProjectResults({ results, onNewProject }: ProjectResultsProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'schedule' | 'review' | 'html'>('plan');

  const downloadHTML = () => {
    const blob = new Blob([results.html_output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-plan.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewHTML = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(results.html_output);
      newWindow.document.close();
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown-to-HTML conversion for display
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\|/g, '</td><td class="border px-2 py-1">')
      .replace(/^([^<\n]+)$/gm, '<p class="mb-2">$1</p>');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Plan Generated</h1>
        <Button onClick={onNewProject} variant="outline">
          Create New Project
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'plan', label: 'Project Plan' },
          { key: 'schedule', label: 'Schedule' },
          { key: 'review', label: 'Review' },
          { key: 'html', label: 'HTML Export' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'plan' && 'Project Plan'}
            {activeTab === 'schedule' && 'Project Schedule'}
            {activeTab === 'review' && 'Review Feedback'}
            {activeTab === 'html' && 'HTML Export'}
          </CardTitle>
          {activeTab === 'html' && (
            <div className="flex space-x-2">
              <Button onClick={previewHTML} size="sm" variant="outline">
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={downloadHTML} size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {activeTab === 'plan' && (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(results.plan) }}
            />
          )}
          {activeTab === 'schedule' && (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(results.schedule) }}
            />
          )}
          {activeTab === 'review' && (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(results.review) }}
            />
          )}
          {activeTab === 'html' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This is the complete HTML document generated for your project. You can preview it or download it for sharing.
              </p>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-96">
                <code>{results.html_output}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}