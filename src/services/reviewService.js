import {
    collection,
    getDocs,
    query,
    limit,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../backend/firebase';

const COLLECTION_NAME = 'reviews';

// Mock data removed as it is now in Firestore

export const reviewService = {
    // Fetch all reviews
    getAllReviews: async (limitCount = 10) => {
        try {
            const q = query(collection(db, COLLECTION_NAME), limit(limitCount));
            const querySnapshot = await getDocs(q);
            const reviews = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return reviews;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    },

    // Seed mock reviews
    seedMockReviews: async () => {
        try {
            const reviewsRef = collection(db, COLLECTION_NAME);
            // Seeding logic removed as mock data is gone
            return true;
        } catch (error) {
            console.error("Error seeding reviews:", error);
            throw error;
        }
    }
};
