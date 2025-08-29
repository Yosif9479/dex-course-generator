import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ModuleCard } from '../components/ModuleCard';
import { AddButton } from '../components/AddButton';
import { Modal } from '../components/Modal';
import { ModuleForm } from '../components/forms/ModuleForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course } from '../types';

interface CourseDetailPageProps {
  course: Course;
  storage: ReturnType<typeof useLocalStorage>;
  onBack: () => void;
  onSelectModule: (moduleId: string) => void;
}

export function CourseDetailPage({ course, storage, onBack, onSelectModule }: CourseDetailPageProps) {
  const { addModule, deleteModule, exportCourse } = storage;
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateModule = (name: string) => {
    const newModule = addModule(course.id, { name, words: [] });
    setShowCreateModal(false);
    onSelectModule(newModule.id);
  };

  const handleDeleteModule = (moduleId: string) => {
    deleteModule(course.id, moduleId);
  };

  const breadcrumbItems = [
    { label: 'Courses', onClick: onBack },
    { label: course.name }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={course.name}
        onBack={onBack}
        showExport={true}
        onExport={() => exportCourse(course.id)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        {course.modules.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No modules yet</h2>
                <p className="text-gray-600">
                  Create your first module to start organizing your vocabulary.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Create Your First Module
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => onSelectModule(module.id)}
                onDelete={() => handleDeleteModule(module.id)}
              />
            ))}
          </div>
        )}
      </main>

      {course.modules.length > 0 && (
        <AddButton 
          onClick={() => setShowCreateModal(true)} 
          label="Add Module" 
        />
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Module"
      >
        <ModuleForm
          onSubmit={handleCreateModule}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}