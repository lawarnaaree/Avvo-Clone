import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    limit,
    addDoc,
    updateDoc,
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

    // Update lawyer rating and review count
    updateLawyerRating: async (lawyerId, newRating, newReviewCount) => {
        try {
            const lawyerRef = doc(db, COLLECTION_NAME, lawyerId);
            await updateDoc(lawyerRef, {
                rating: Number(newRating.toFixed(1)),
                reviewCount: newReviewCount
            });
            return true;
        } catch (error) {
            console.error("Error updating lawyer rating:", error);
            return false;
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

    // Update lawyer profile in both users collection and potentially lawyers collection
    updateLawyerProfile: async (userId, profileData) => {
        try {
            // Update users collection
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                ...profileData,
                updatedAt: serverTimestamp()
            });

            // Also update/create in lawyers collection for public listing
            const lawyerRef = doc(db, COLLECTION_NAME, userId);
            const lawyerDoc = await getDoc(lawyerRef);

            const lawyerPublicData = {
                name: profileData.displayName,
                specialty: profileData.specialty,
                title: profileData.title,
                bio: profileData.bio,
                experience: profileData.experience,
                education: profileData.education,
                office: profileData.office,
                phone: profileData.phone,
                website: profileData.website,
                updatedAt: serverTimestamp()
            };

            if (lawyerDoc.exists()) {
                await updateDoc(lawyerRef, lawyerPublicData);
            } else {
                // If they don't exist in lawyers yet, create them with defaults
                await setDoc(lawyerRef, {
                    ...lawyerPublicData,
                    rating: 0,
                    reviewCount: 0,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.displayName)}&background=random`,
                    city: profileData.office?.split(',').pop()?.trim() || 'Kathmandu'
                });
            }
            return true;
        } catch (error) {
            console.error("Error updating lawyer profile:", error);
            throw error;
        }
    }
};
