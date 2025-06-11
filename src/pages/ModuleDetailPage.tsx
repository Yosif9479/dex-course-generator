import React, {useState} from 'react';
import {Header} from '../components/Header';
import {Breadcrumbs} from '../components/Breadcrumbs';
import {WordCard} from '../components/WordCard';
import {AddButton} from '../components/AddButton';
import {Modal} from '../components/Modal';
import {WordForm} from '../components/forms/WordForm';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {Course, Module, Word} from '../types';

interface ModuleDetailPageProps {
    course: Course;
    module: Module;
    onBack: () => void;
    onBackToCourse: () => void;
}

export function ModuleDetailPage({course, module, onBack, onBackToCourse}: ModuleDetailPageProps) {
    const {updateCourse, settings} = useLocalStorage();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingWord, setEditingWord] = useState<Word | null>(null);
    const [currentModule, setCurrentModule] = useState<Module>(module);

    const handleCreateWord = (wordData: Omit<Word, 'id'>) => {
        const newWord: Word = {
            ...wordData,
            id: crypto.randomUUID()
        };

        const updatedModules = course.modules.map(m =>
            m.id === module.id
                ? {...m, words: [...m.words, newWord]}
                : m
        );

        updateCourse(course.id, {modules: updatedModules});

        setCurrentModule(prev => ({
            ...prev,
            words: [...prev.words, newWord]
        }));

        setShowCreateModal(false);
    };

    const handleEditWord = (wordData: Omit<Word, 'id'>) => {
        if (!editingWord) return;

        const updatedModules = course.modules.map(m =>
            m.id === module.id
                ? {
                    ...m,
                    words: m.words.map(w =>
                        w.id === editingWord.id ? {...wordData, id: w.id} : w
                    )
                }
                : m
        );

        updateCourse(course.id, {modules: updatedModules});

        setCurrentModule(prev => ({
            ...prev,
            words: prev.words.map(w =>
                w.id === editingWord.id ? {...wordData, id: w.id} : w
            )
        }));

        setEditingWord(null);
    };

    const handleDeleteWord = (wordId: string) => {
        const updatedModules = course.modules.map(m =>
            m.id === module.id
                ? {...m, words: m.words.filter(w => w.id !== wordId)}
                : m
        );

        updateCourse(course.id, {modules: updatedModules});

        setCurrentModule(prev => ({
            ...prev,
            words: prev.words.filter(w => w.id !== wordId)
        }));
    };

    const breadcrumbItems = [
        {label: 'Courses', onClick: onBackToCourse},
        {label: course.name, onClick: onBack},
        {label: currentModule.name}
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={currentModule.name}
                onBack={onBack}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumbs items={breadcrumbItems}/>

                {currentModule.words.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="mb-8">
                                <div
                                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🔤</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">No words yet</h2>
                                <p className="text-gray-600">
                                    Add your first word to start building your vocabulary.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                            >
                                Add Your First Word
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentModule.words.map((word) => (
                            <WordCard
                                key={word.id}
                                word={word}
                                settings={settings}
                                onEdit={() => setEditingWord(word)}
                                onDelete={() => handleDeleteWord(word.id)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {currentModule.words.length > 0 && (
                <AddButton
                    onClick={() => setShowCreateModal(true)}
                    label="Add Word"
                />
            )}

            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Word"
            >
                <WordForm
                    settings={settings}
                    onSubmit={handleCreateWord}
                    onCancel={() => setShowCreateModal(false)}
                />
            </Modal>

            <Modal
                isOpen={!!editingWord}
                onClose={() => setEditingWord(null)}
                title="Edit Word"
            >
                {editingWord && (
                    <WordForm
                        initialWord={editingWord}
                        settings={settings}
                        onSubmit={handleEditWord}
                        onCancel={() => setEditingWord(null)}
                        submitLabel="Update Word"
                    />
                )}
            </Modal>
        </div>
    );
}
