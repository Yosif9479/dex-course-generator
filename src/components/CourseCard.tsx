import React from 'react';
import { Book, Calendar, Trash2, Download } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export function CourseCard({ course, onClick, onDelete, onExport }: CourseCardProps) {
  const moduleCount = course.modules.length;
  const wordCount = course.modules.reduce((total, module) => total + module.words.length, 0);
  const createdDate = new Date(course.createdAt).toLocaleDateString();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
      onDelete();
    }
  };

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExport();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Book className="h-8 w-8 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Export course"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete course"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Modules:</span>
          <span className="font-medium">{moduleCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Words:</span>
          <span className="font-medium">{wordCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Created:</span>
          <span className="font-medium flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {createdDate}
          </span>
        </div>
      </div>
    </div>
  );
}