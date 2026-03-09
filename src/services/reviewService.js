import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '../backend/firebase';

const COLLECTION_NAME = 'reviews';

export const reviewService = {
    // Add a new review
    addReview: async (reviewData) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...reviewData,
                createdAt: serverTimestamp()
            });

            // Update lawyer's overall rating
            await reviewService.updateLawyerStats(reviewData.lawyerId);

            return docRef.id;
        } catch (error) {
            console.error("Error adding review:", error);
            throw error;
        }
    },

    // Get all reviews for a lawyer
    getLawyerReviews: async (lawyerId) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('lawyerId', '==', lawyerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    },

    // Recalculate lawyer's average rating and review count
    updateLawyerStats: async (lawyerId) => {
        try {
            const reviews = await reviewService.getLawyerReviews(lawyerId);
            const reviewCount = reviews.length;
            const averageRating = reviewCount > 0
                ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviewCount
                : 0;

            // Update in 'lawyers' collection
            const lawyerRef = doc(db, 'lawyers', lawyerId);
            await updateDoc(lawyerRef, {
                rating: Number(averageRating.toFixed(1)),
                reviewCount: reviewCount
            });

            return true;
        } catch (error) {
            console.error("Error updating lawyer stats:", error);
            return false;
        }
    }
};
