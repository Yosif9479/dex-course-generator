import React from 'react';
import { Header } from '../components/Header';
import { SettingsForm } from '../components/forms/SettingsForm';
import { Settings } from '../types';

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onBack: () => void;
}

export function SettingsPage({ settings, onSave, onBack }: SettingsPageProps) {
  const handleSave = (newSettings: Settings) => {
    onSave(newSettings);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Settings"
        onBack={onBack}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Locale Configuration</h2>
            <p className="text-gray-600">
              Manage available locales and set default translation languages for new words.
            </p>
          </div>
          
          <SettingsForm
            settings={settings}
            onSave={handleSave}
            onCancel={onBack}
          />
        </div>
      </main>
    </div>
  );
}