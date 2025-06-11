import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Word, Translation, Settings } from '../../types';

interface WordFormProps {
  initialWord?: Word;
  settings: Settings;
  onSubmit: (word: Omit<Word, 'id'>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function WordForm({ 
  initialWord, 
  settings,
  onSubmit, 
  onCancel, 
  submitLabel = 'Create Word' 
}: WordFormProps) {
  const [term, setTerm] = useState(initialWord?.term || '');
  const [translations, setTranslations] = useState<Translation[]>(
    initialWord?.translations || 
    settings.defaultTranslationLocales.map(locale => ({ locale, value: '' }))
  );

  const addTranslation = () => {
    setTranslations([...translations, { locale: 'en', value: '' }]);
  };

  const removeTranslation = (index: number) => {
    setTranslations(translations.filter((_, i) => i !== index));
  };

  const updateTranslation = (index: number, field: 'locale' | 'value', value: string) => {
    const updated = translations.map((translation, i) => 
      i === index ? { ...translation, [field]: value } : translation
    );
    setTranslations(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      const wordData: Omit<Word, 'id'> = {
        term: term.trim(),
        translations: translations.filter(t => t.value.trim())
      };
      onSubmit(wordData);
    }
  };

  const getLocaleName = (code: string) => {
    return settings.locales.find(locale => locale.code === code)?.name || code;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
          Term
        </label>
        <input
          type="text"
          id="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter the term..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          autoFocus
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Translations
          </label>
          <button
            type="button"
            onClick={addTranslation}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Translation
          </button>
        </div>

        <div className="space-y-3">
          {translations.map((translation, index) => (
            <div key={index} className="flex items-center space-x-3">
              <select
                value={translation.locale}
                onChange={(e) => updateTranslation(index, 'locale', e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {settings.locales.map(locale => (
                  <option key={locale.code} value={locale.code}>
                    {locale.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={translation.value}
                onChange={(e) => updateTranslation(index, 'value', e.target.value)}
                placeholder="Enter translation..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => removeTranslation(index)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {translations.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm">No translations added yet</p>
              <button
                type="button"
                onClick={addTranslation}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Add your first translation
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}