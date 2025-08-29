import { useState, useEffect } from 'react';
import { Course, Settings, DEFAULT_SETTINGS, Module, Word } from '../types';

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

  const addModule = (courseId: string, module: Omit<Module, 'id'>) => {
    const newModule: Module = {
      ...module,
      id: crypto.randomUUID()
    };

    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, modules: [...course.modules, newModule] }
        : course
    );
    saveCourses(updatedCourses);
    return newModule;
  };

  const updateModule = (courseId: string, moduleId: string, updates: Partial<Module>) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            modules: course.modules.map(module =>
              module.id === moduleId ? { ...module, ...updates } : module
            )
          }
        : course
    );
    saveCourses(updatedCourses);
  };

  const deleteModule = (courseId: string, moduleId: string) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, modules: course.modules.filter(module => module.id !== moduleId) }
        : course
    );
    saveCourses(updatedCourses);
  };

  const addWord = (courseId: string, moduleId: string, word: Omit<Word, 'id'>) => {
    const newWord: Word = {
      ...word,
      id: crypto.randomUUID()
    };

    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            modules: course.modules.map(module =>
              module.id === moduleId
                ? { ...module, words: [...module.words, newWord] }
                : module
            )
          }
        : course
    );
    saveCourses(updatedCourses);
    return newWord;
  };

  const updateWord = (courseId: string, moduleId: string, wordId: string, updates: Omit<Word, 'id'>) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            modules: course.modules.map(module =>
              module.id === moduleId
                ? {
                    ...module,
                    words: module.words.map(word =>
                      word.id === wordId ? { ...updates, id: wordId } : word
                    )
                  }
                : module
            )
          }
        : course
    );
    saveCourses(updatedCourses);
  };

  const deleteWord = (courseId: string, moduleId: string, wordId: string) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            modules: course.modules.map(module =>
              module.id === moduleId
                ? { ...module, words: module.words.filter(word => word.id !== wordId) }
                : module
            )
          }
        : course
    );
    saveCourses(updatedCourses);
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

  const importFromJSON = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // Check if it's a single course or array of courses
          if (Array.isArray(data)) {
            // Import multiple courses
            const validCourses = data.filter(item => 
              item && typeof item === 'object' && 
              typeof item.name === 'string' && 
              Array.isArray(item.modules)
            );
            
            const coursesToImport = validCourses.map(course => ({
              ...course,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              modules: course.modules.map((module: any) => ({
                ...module,
                id: crypto.randomUUID(),
                words: module.words?.map((word: any) => ({
                  ...word,
                  id: crypto.randomUUID()
                })) || []
              }))
            }));
            
            saveCourses([...courses, ...coursesToImport]);
          } else if (data && typeof data === 'object' && typeof data.name === 'string') {
            // Import single course
            const courseToImport: Course = {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              modules: data.modules?.map((module: any) => ({
                ...module,
                id: crypto.randomUUID(),
                words: module.words?.map((word: any) => ({
                  ...word,
                  id: crypto.randomUUID()
                })) || []
              })) || []
            };
            
            saveCourses([...courses, courseToImport]);
          } else {
            throw new Error('Invalid JSON format');
          }
          
          resolve();
        } catch (error) {
          reject(new Error('Invalid JSON file format'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Helper function to get current course data
  const getCourse = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  // Helper function to get current module data
  const getModule = (courseId: string, moduleId: string) => {
    const course = getCourse(courseId);
    return course?.modules.find(module => module.id === moduleId);
  };

  return {
    courses,
    settings,
    addCourse,
    updateCourse,
    deleteCourse,
    addModule,
    updateModule,
    deleteModule,
    addWord,
    updateWord,
    deleteWord,
    exportCourse,
    exportAllCourses,
    importFromJSON,
    saveSettings,
    getCourse,
    getModule,
  };
}