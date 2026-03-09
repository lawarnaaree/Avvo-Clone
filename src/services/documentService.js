import { db } from '../backend/firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

const TEMPLATES_COLLECTION = 'documentTemplates';
const USER_DOCS_COLLECTION = 'userDocuments';

export const documentService = {
    async getDocumentTemplates() {
        const snap = await getDocs(collection(db, TEMPLATES_COLLECTION));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async getTemplatesByCategory(category) {
        const q = query(collection(db, TEMPLATES_COLLECTION), where('category', '==', category));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async getTemplateBySlug(slug) {
        const q = query(collection(db, TEMPLATES_COLLECTION), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
    },

    async saveUserDocument(userId, documentData) {
        return await addDoc(collection(db, USER_DOCS_COLLECTION), {
            userId,
            ...documentData,
            createdAt: serverTimestamp()
        });
    },

    async getUserDocuments(userId) {
        try {
            const q = query(
                collection(db, USER_DOCS_COLLECTION),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error("Error fetching user documents:", error);
            return [];
        }
    }
};
