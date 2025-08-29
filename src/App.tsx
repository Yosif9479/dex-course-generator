import React, { useState } from 'react';
import { CourseListPage } from './pages/CourseListPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { useLocalStorage } from './hooks/useLocalStorage';

type AppState = 
  | { page: 'courses' }
  | { page: 'course'; courseId: string }
  | { page: 'module'; courseId: string; moduleId: string }
  | { page: 'settings' };

function App() {
  const storage = useLocalStorage();
  const [state, setState] = useState<AppState>({ page: 'courses' });

  const navigateToCourses = () => {
    setState({ page: 'courses' });
  };

  const navigateToCourse = (courseId: string) => {
    setState({ page: 'course', courseId });
  };

  const navigateToModule = (courseId: string, moduleId: string) => {
    setState({ page: 'module', courseId, moduleId });
  };

  const navigateToSettings = () => {
    setState({ page: 'settings' });
  };

  if (state.page === 'settings') {
    return (
      <SettingsPage
        settings={storage.settings}
        onSave={storage.saveSettings}
        onBack={navigateToCourses}
      />
    );
  }

  if (state.page === 'courses') {
    return (
      <CourseListPage 
        storage={storage}
        onSelectCourse={navigateToCourse}
        onOpenSettings={navigateToSettings}
      />
    );
  }

  if (state.page === 'course') {
    const course = storage.getCourse(state.courseId);
    if (!course) {
      // Course not found, navigate back to courses
      navigateToCourses();
      return null;
    }

    return (
      <CourseDetailPage
        course={course}
        storage={storage}
        onBack={navigateToCourses}
        onSelectModule={(moduleId) => navigateToModule(state.courseId, moduleId)}
      />
    );
  }

  if (state.page === 'module') {
    const course = storage.getCourse(state.courseId);
    const module = storage.getModule(state.courseId, state.moduleId);
    
    if (!course || !module) {
      // Course or module not found, navigate back
      if (course) {
        navigateToCourse(state.courseId);
      } else {
        navigateToCourses();
      }
      return null;
    }

    return (
      <ModuleDetailPage
        course={course}
        module={module}
        storage={storage}
        onBack={() => navigateToCourse(state.courseId)}
        onBackToCourse={navigateToCourses}
      />
    );
  }

  return null;
}

export default App;