import React from 'react';
import { BookOpen, Download, ArrowLeft, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  showExport?: boolean;
  showSettings?: boolean;
}

export function Header({ title, onBack, onExport, onSettings, showExport = false, showSettings = false }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {showSettings && onSettings && (
              <button
                onClick={onSettings}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            )}
            {showExport && onExport && (
              <button
                onClick={onExport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}