import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
  onDelete: () => void;
}

export function ModuleCard({ module, onClick, onDelete }: ModuleCardProps) {
  const wordCount = module.words.length;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete module "${module.name}"?`)) {
      onDelete();
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete module"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
      </div>
    </div>
  );
}