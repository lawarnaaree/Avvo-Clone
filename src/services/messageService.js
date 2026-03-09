import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs
} from 'firebase/firestore';
import { db } from '../backend/firebase';

const CONVERSATIONS_COLLECTION = 'conversations';

export const messageService = {
    // Create or get conversation ID between two users
    getConversationId: (uid1, uid2) => {
        return [uid1, uid2].sort().join('_');
    },

    // Send a message
    sendMessage: async (senderId, receiverId, text) => {
        try {
            const convId = messageService.getConversationId(senderId, receiverId);
            const convRef = doc(db, CONVERSATIONS_COLLECTION, convId);

            // Ensure conversation document exists
            const convDoc = await getDoc(convRef);
            if (!convDoc.exists()) {
                await setDoc(convRef, {
                    participants: [senderId, receiverId],
                    lastMessage: text,
                    lastMessageAt: serverTimestamp(),
                    createdAt: serverTimestamp()
                });
            } else {
                await updateDoc(convRef, {
                    lastMessage: text,
                    lastMessageAt: serverTimestamp()
                });
            }

            // Add message to subcollection
            const messagesRef = collection(db, CONVERSATIONS_COLLECTION, convId, 'messages');
            await addDoc(messagesRef, {
                senderId,
                text,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    // Listen to messages in a conversation (Real-time)
    subscribeToMessages: (convId, callback) => {
        const q = query(
            collection(db, CONVERSATIONS_COLLECTION, convId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    },

    // Get all conversations for a user
    getConversations: async (userId) => {
        try {
            const q = query(
                collection(db, CONVERSATIONS_COLLECTION),
                where('participants', 'array-contains', userId),
                orderBy('lastMessageAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return [];
        }
    }
};
