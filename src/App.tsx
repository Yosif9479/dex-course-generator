import React, { useState } from 'react';
import { CourseListPage } from './pages/CourseListPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Course, Module } from './types';

type AppState = 
  | { page: 'courses' }
  | { page: 'course'; course: Course }
  | { page: 'module'; course: Course; module: Module }
  | { page: 'settings' };

function App() {
  const { settings, saveSettings } = useLocalStorage();
  const [state, setState] = useState<AppState>({ page: 'courses' });

  const navigateToCourses = () => {
    setState({ page: 'courses' });
  };

  const navigateToCourse = (course: Course) => {
    setState({ page: 'course', course });
  };

  const navigateToModule = (course: Course, module: Module) => {
    setState({ page: 'module', course, module });
  };

  const navigateToSettings = () => {
    setState({ page: 'settings' });
  };

  if (state.page === 'settings') {
    return (
      <SettingsPage
        settings={settings}
        onSave={saveSettings}
        onBack={navigateToCourses}
      />
    );
  }

  if (state.page === 'courses') {
    return (
      <CourseListPage 
        onSelectCourse={navigateToCourse}
        onOpenSettings={navigateToSettings}
      />
    );
  }

  if (state.page === 'course') {
    return (
      <CourseDetailPage
        course={state.course}
        onBack={navigateToCourses}
        onSelectModule={navigateToModule}
      />
    );
  }

  if (state.page === 'module') {
    return (
      <ModuleDetailPage
        course={state.course}
        module={state.module}
        onBack={() => navigateToCourse(state.course)}
        onBackToCourse={navigateToCourses}
      />
    );
  }

  return null;
}

export default App;