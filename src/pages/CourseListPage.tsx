import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CourseCard } from '../components/CourseCard';
import { AddButton } from '../components/AddButton';
import { Modal } from '../components/Modal';
import { CourseForm } from '../components/forms/CourseForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course } from '../types';

interface CourseListPageProps {
  onSelectCourse: (course: Course) => void;
  onOpenSettings: () => void;
}

export function CourseListPage({ onSelectCourse, onOpenSettings }: CourseListPageProps) {
  const { courses, addCourse, deleteCourse, exportCourse, exportAllCourses } = useLocalStorage();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateCourse = (name: string) => {
    const newCourse = addCourse({ name, modules: [] });
    setShowCreateModal(false);
    onSelectCourse(newCourse);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Vocabulary Manager" 
        showExport={courses.length > 0}
        showSettings={true}
        onExport={exportAllCourses}
        onSettings={onOpenSettings}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h2>
                <p className="text-gray-600">
                  Create your first course to start building your vocabulary collection.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Create Your First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => onSelectCourse(course)}
                onDelete={() => deleteCourse(course.id)}
                onExport={() => exportCourse(course.id)}
              />
            ))}
          </div>
        )}
      </main>

      {courses.length > 0 && (
        <AddButton 
          onClick={() => setShowCreateModal(true)} 
          label="Add Course" 
        />
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Course"
      >
        <CourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}