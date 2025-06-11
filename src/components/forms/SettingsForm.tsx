import React, { useState } from 'react';
import { Plus, Trash2, Move } from 'lucide-react';
import { Settings, LocaleOption, DEFAULT_LOCALE_OPTIONS } from '../../types';

interface SettingsFormProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onCancel: () => void;
}

export function SettingsForm({ settings, onSave, onCancel }: SettingsFormProps) {
  const [locales, setLocales] = useState<LocaleOption[]>(settings.locales);
  const [defaultTranslationLocales, setDefaultTranslationLocales] = useState<string[]>(
    settings.defaultTranslationLocales
  );
  const [newLocaleCode, setNewLocaleCode] = useState('');
  const [newLocaleName, setNewLocaleName] = useState('');

  const addLocale = () => {
    if (newLocaleCode.trim() && newLocaleName.trim()) {
      const newLocale: LocaleOption = {
        code: newLocaleCode.trim().toLowerCase(),
        name: newLocaleName.trim()
      };
      
      if (!locales.find(l => l.code === newLocale.code)) {
        setLocales([...locales, newLocale]);
        setNewLocaleCode('');
        setNewLocaleName('');
      }
    }
  };

  const removeLocale = (code: string) => {
    setLocales(locales.filter(l => l.code !== code));
    setDefaultTranslationLocales(defaultTranslationLocales.filter(l => l !== code));
  };

  const toggleDefaultLocale = (code: string) => {
    if (defaultTranslationLocales.includes(code)) {
      setDefaultTranslationLocales(defaultTranslationLocales.filter(l => l !== code));
    } else {
      setDefaultTranslationLocales([...defaultTranslationLocales, code]);
    }
  };

  const resetToDefaults = () => {
    setLocales(DEFAULT_LOCALE_OPTIONS);
    setDefaultTranslationLocales(['ru', 'tg', 'en']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      locales,
      defaultTranslationLocales
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Available Locales</h3>
          <button
            type="button"
            onClick={resetToDefaults}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset to Defaults
          </button>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
          {locales.map((locale) => (
            <div key={locale.code} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                  {locale.code}
                </span>
                <span className="text-sm font-medium">{locale.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => toggleDefaultLocale(locale.code)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    defaultTranslationLocales.includes(locale.code)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {defaultTranslationLocales.includes(locale.code) ? 'Default' : 'Add Default'}
                </button>
                <button
                  type="button"
                  onClick={() => removeLocale(locale.code)}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Locale</h4>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newLocaleCode}
              onChange={(e) => setNewLocaleCode(e.target.value)}
              placeholder="Code (e.g., fr)"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <input
              type="text"
              value={newLocaleName}
              onChange={(e) => setNewLocaleName(e.target.value)}
              placeholder="Name (e.g., French)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              type="button"
              onClick={addLocale}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Default Translation Locales</h3>
        <p className="text-sm text-gray-600 mb-4">
          These locales will be automatically added when creating new words.
        </p>
        <div className="flex flex-wrap gap-2">
          {defaultTranslationLocales.map((code) => {
            const locale = locales.find(l => l.code === code);
            return locale ? (
              <span
                key={code}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {locale.name}
                <button
                  type="button"
                  onClick={() => toggleDefaultLocale(code)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {defaultTranslationLocales.length === 0 && (
            <span className="text-sm text-gray-500 italic">No default locales selected</span>
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
          Save Settings
        </button>
      </div>
    </form>
  );
}