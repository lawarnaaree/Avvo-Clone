import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    limit,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../backend/firebase';

const COLLECTION_NAME = 'guides';

// Mock data removed as it is now in Firestore

export const guideService = {
    // Fetch all guides
    getAllGuides: async () => {
        try {
            const guidesRef = collection(db, COLLECTION_NAME);
            const querySnapshot = await getDocs(guidesRef);
            const guides = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return guides;
        } catch (error) {
            console.error("Error fetching guides:", error);
            return [];
        }
    },

    // Get a specific guide by ID
    getGuideById: async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching guide by ID:", error);
            return null;
        }
    },

    // Seed mock data to Firestore
    seedMockGuides: async () => {
        try {
            const guidesRef = collection(db, COLLECTION_NAME);
            // Seeding logic removed as mock data is gone
            return true;
        } catch (error) {
            console.error("Error seeding guides:", error);
            throw error;
        }
    }
};
