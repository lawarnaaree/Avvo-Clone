import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../backend/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Fetch user profile from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                    } else {
                        setUserProfile(null);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const register = async (email, password, name, role = 'user') => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        if (name) {
            await updateProfile(newUser, { displayName: name });
        }

        // Create user document in Firestore
        const profileData = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: name,
            role: role,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', newUser.uid), profileData);
        setUserProfile(profileData);

        return userCredential;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        user,
        userProfile,
        register,
        login,
        logout,
        loading,
        isLawyer: userProfile?.role === 'lawyer'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
