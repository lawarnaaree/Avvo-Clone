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
// Mock data removed as it is now in Firestore

const COLLECTION_NAME = 'lawyers';

export const lawyerService = {
    // Fetch all lawyers with optional filters
    getAllLawyers: async (filters = {}) => {
        try {
            const lawyersRef = collection(db, COLLECTION_NAME);
            let q = query(lawyersRef);

            if (filters.city) {
                q = query(q, where('city', '==', filters.city));
            }
            if (filters.specialty) {
                q = query(q, where('specialty', '==', filters.specialty));
            }

            const querySnapshot = await getDocs(q);
            const lawyers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Return empty array if Firestore is empty
            return lawyers;
        } catch (error) {
            console.error("Error fetching lawyers:", error);
            return [];
        }
    },

    // Get a specific lawyer by ID
    getLawyerById: async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching lawyer by ID:", error);
            return null;
        }
    },

    // Seed mock data to Firestore (Utility function)
    seedMockData: async () => {
        try {
            const lawyersRef = collection(db, COLLECTION_NAME);
            // Seeding logic removed as mock data is gone
            return true;
        } catch (error) {
            console.error("Error seeding data:", error);
            throw error;
        }
    }
};
