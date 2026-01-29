import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Récupérer les données utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const register = async (email, password, companyName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Créer le document utilisateur dans Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      companyName,
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'blue',
        language: 'fr',
        paperSize: 'A4',
        currency: 'FCFA'
      },
      company: {
        name: companyName,
        address: '',
        city: '',
        phone: '',
        email: email,
        ifu: '',
        rccm: '',
        logo: null,
        header: null,
        footer: null
      }
    });
    
    return result.user;
  };

  const logout = () => signOut(auth);

  const updateUserData = async (newData) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), newData, { merge: true });
      setUserData(prev => ({ ...prev, ...newData }));
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    register,
    logout,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};