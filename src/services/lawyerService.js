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
import { lawyers as mockLawyers } from '../data/lawyers';

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

            // Fallback to mock data if Firestore is empty or fails
            return lawyers.length > 0 ? lawyers : mockLawyers;
        } catch (error) {
            console.error("Error fetching lawyers:", error);
            return mockLawyers;
        }
    },

    // Get a specific lawyer by ID
    getLawyerById: async (id) => {
        try {
            // Check if it's a mock numeric ID
            if (!isNaN(id) && parseInt(id) <= mockLawyers.length) {
                return mockLawyers.find(l => l.id === parseInt(id));
            }

            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return mockLawyers.find(l => l.id === parseInt(id)) || null;
            }
        } catch (error) {
            console.error("Error fetching lawyer by ID:", error);
            return mockLawyers.find(l => l.id === parseInt(id)) || null;
        }
    },

    // Seed mock data to Firestore (Utility function)
    seedMockData: async () => {
        try {
            const lawyersRef = collection(db, COLLECTION_NAME);
            for (const lawyer of mockLawyers) {
                // Remove local numeric ID and use Firestore auto-ID
                const { id, ...lawyerData } = lawyer;
                await addDoc(lawyersRef, {
                    ...lawyerData,
                    createdAt: serverTimestamp()
                });
            }
            return true;
        } catch (error) {
            console.error("Error seeding data:", error);
            return false;
        }
    }
};
