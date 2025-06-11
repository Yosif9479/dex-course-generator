import React, { useState } from 'react';

interface ModuleFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function ModuleForm({ 
  initialName = '', 
  onSubmit, 
  onCancel, 
  submitLabel = 'Create Module' 
}: ModuleFormProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-2">
          Module Name
        </label>
        <input
          type="text"
          id="moduleName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter module name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          autoFocus
        />
      </div>
      
      <div className="flex items-center justify-end space-x-3 pt-4">
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