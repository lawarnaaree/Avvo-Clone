import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    getDocs
} from 'firebase/firestore';
import { db } from '../backend/firebase';

const COLLECTION_NAME = 'appointments';

export const appointmentService = {
    // Book a new appointment
    bookAppointment: async (appointmentData) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...appointmentData,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error booking appointment:", error);
            throw error;
        }
    },

    // Get appointments for a lawyer
    getLawyerAppointments: async (lawyerId) => {
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
            console.error("Error fetching lawyer appointments:", error);
            return [];
        }
    },

    // Get appointments for a user
    getUserAppointments: async (userId) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching user appointments:", error);
            return [];
        }
    },

    // Update appointment status (Accept/Reject/Cancel)
    updateStatus: async (id, status) => {
        try {
            const appointmentRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(appointmentRef, {
                status: status,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error updating appointment status:", error);
            throw error;
        }
    }
};
