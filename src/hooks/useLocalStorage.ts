import { useState, useEffect } from 'react';
import { Course, Settings, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEY = 'vocabulary-courses';
const SETTINGS_KEY = 'vocabulary-settings';

export function useLocalStorage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load courses
    const storedCourses = localStorage.getItem(STORAGE_KEY);
    if (storedCourses) {
      try {
        setCourses(JSON.parse(storedCourses));
      } catch (error) {
        console.error('Error parsing stored courses:', error);
        setCourses([]);
      }
    }

    // Load settings
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (error) {
        console.error('Error parsing stored settings:', error);
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCourses));
  };

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const addCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveCourses([...courses, newCourse]);
    return newCourse;
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, ...updates } : course
    );
    saveCourses(updatedCourses);
  };

  const deleteCourse = (courseId: string) => {
    const filteredCourses = courses.filter(course => course.id !== courseId);
    saveCourses(filteredCourses);
  };

  const exportCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const dataStr = JSON.stringify(course, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const exportAllCourses = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'all_courses.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return {
    courses,
    settings,
    addCourse,
    updateCourse,
    deleteCourse,
    exportCourse,
    exportAllCourses,
    saveSettings,
  };
}