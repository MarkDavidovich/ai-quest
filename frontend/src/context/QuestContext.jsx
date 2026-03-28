import React, { createContext, useContext, useState } from 'react';

const QuestContext = createContext();

export const useQuest = () => useContext(QuestContext);

export const QuestProvider = ({ children, initialQuestProgress = {} }) => {
    // שומר את מצב הקווסטים. למשל: { tutorial: 'needs_potion' }
    const [questProgress, setQuestProgress] = useState(initialQuestProgress);

    // פונקציה לעדכון שלב בקווסט ספציפי
    const advanceQuest = (questId, step) => {
        setQuestProgress(prev => ({
            ...prev,
            [questId]: step
        }));
    };

    // פונקציה לקבלת השלב הנוכחי של קווסט (מחזיר 'unstarted' אם לא התחיל)
    const getQuestStep = (questId) => {
        return questProgress[questId] || 'unstarted';
    };

    return (
        <QuestContext.Provider value={{ questProgress, advanceQuest, getQuestStep }}>
            {children}
        </QuestContext.Provider>
    );
};