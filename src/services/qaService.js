import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    serverTimestamp,
    updateDoc,
    arrayUnion
} from 'firebase/firestore';
import { db } from '../backend/firebase';

const COLLECTION_NAME = 'questions';

// Mock data removed as it is now in Firestore

export const qaService = {
    // Fetch all questions ordered by creation time
    getQuestions: async (limitCount = 10) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            const questions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return questions;
        } catch (error) {
            console.error("Error fetching questions:", error);
            return [];
        }
    },

    // Post a new question
    postQuestion: async (questionData) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...questionData,
                answersCount: 0,
                likes: 0,
                createdAt: serverTimestamp(),
                topAnswer: null
            });
            return docRef.id;
        } catch (error) {
            console.error("Error posting question:", error);
            throw error;
        }
    },

    // Post an answer to a question (Lawyer only)
    addAnswer: async (questionId, answerData) => {
        try {
            const questionRef = doc(db, COLLECTION_NAME, questionId);
            const questionSnap = await getDoc(questionRef);

            if (!questionSnap.exists()) {
                throw new Error("Question not found");
            }

            const currentData = questionSnap.data();
            const newAnswer = {
                ...answerData,
                createdAt: new Date().toISOString()
            };

            await updateDoc(questionRef, {
                answers: arrayUnion(newAnswer),
                answersCount: (currentData.answersCount || 0) + 1,
                // Automatically set topAnswer if it's the first answer
                topAnswer: currentData.topAnswer ? currentData.topAnswer : newAnswer
            });

            return true;
        } catch (error) {
            console.error("Error adding answer:", error);
            throw error;
        }
    }
};
