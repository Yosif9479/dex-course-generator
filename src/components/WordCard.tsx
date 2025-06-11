import React from 'react';
import { Globe, Trash2 } from 'lucide-react';
import { Word, Settings } from '../types';

interface WordCardProps {
  word: Word;
  settings: Settings;
  onEdit: () => void;
  onDelete: () => void;
}

export function WordCard({ word, settings, onEdit, onDelete }: WordCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the word "${word.term}"?`)) {
      onDelete();
    }
  };

  const getLocaleName = (code: string) => {
    return settings.locales.find(locale => locale.code === code)?.name || code;
  };

  return (
    <div
      onClick={onEdit}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Globe className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">{word.term}</h3>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete word"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {word.translations.map((translation, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{getLocaleName(translation.locale)}:</span>
            <span className="font-medium text-gray-900">{translation.value}</span>
          </div>
        ))}
        {word.translations.length === 0 && (
          <p className="text-sm text-gray-500 italic">No translations yet</p>
        )}
      </div>
    </div>
  );
}