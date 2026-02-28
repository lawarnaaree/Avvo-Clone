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

    // Seed mock questions
    seedMockQuestions: async () => {
        try {
            const questionsRef = collection(db, COLLECTION_NAME);
            // Seeding logic removed as mock data is gone
            return true;
        } catch (error) {
            console.error("Error seeding questions:", error);
            throw error;
        }
    }
};
