import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { UserProfile, AdminProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  adminProfile: AdminProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (identifierOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  adminProfile: null,
  isAdmin: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (currentUser: User) => {
    try {
      // 1. Check if user is Admin
      const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
      if (adminDoc.exists() && adminDoc.data()?.isActive !== false) {
        const aData = adminDoc.data() as AdminProfile;
        setAdminProfile(aData);
        setIsAdmin(true);
      } else if (
        currentUser.email?.toLowerCase() === 'admin@ppointern.com' ||
        currentUser.email?.toLowerCase() === 'admin@internmitra.com'
      ) {
        setIsAdmin(true);
        setAdminProfile({
          uid: currentUser.uid,
          email: currentUser.email,
          role: 'admin',
          fullName: 'Master Administrator',
          createdAt: new Date().toISOString(),
          isActive: true
        });
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }

      // 2. Check if student profile in 'users'
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const uData = userDoc.data() as UserProfile;
        setProfile(uData);
      } else if (!adminDoc.exists()) {
        // Fallback profile if newly registered
        const fallback: UserProfile = {
          uid: currentUser.uid,
          fullName: currentUser.displayName || 'Student',
          email: currentUser.email || '',
          contactNumber: '',
          gender: 'Male',
          parentName: '',
          district: '',
          college: '',
          university: '',
          degree: 'B.Tech / B.E.',
          department: '',
          subject: '',
          session: '2023-27',
          semester: 'Semester 5',
          universityRoll: '',
          internshipDomain: 'Web Development & Full Stack',
          isPaid: false,
          paymentStatus: 'pending',
          registrationDate: new Date().toISOString()
        };
        setProfile(fallback);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProfile(currentUser);
      } else {
        setProfile(null);
        setAdminProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (identifierOrEmail: string, password: string) => {
    setLoading(true);
    let emailToUse = identifierOrEmail.trim().toLowerCase();

    // If identifier doesn't have @, query Firestore directly for matching student
    if (!emailToUse.includes('@')) {
      try {
        const usersRef = collection(db, 'users');
        const cleanPhone = identifierOrEmail.replace(/\D/g, '').slice(-10);
        const lookups = [];

        if (cleanPhone.length === 10) {
          lookups.push(getDocs(query(usersRef, where('contactNumber', '==', cleanPhone), limit(1))));
        }

        lookups.push(getDocs(query(usersRef, where('universityRoll', '==', identifierOrEmail.trim()), limit(1))));
        lookups.push(getDocs(query(usersRef, where('universityRoll', '==', identifierOrEmail.trim().toUpperCase()), limit(1))));
        lookups.push(getDocs(query(usersRef, where('universityRollNo', '==', identifierOrEmail.trim()), limit(1))));
        lookups.push(getDocs(query(usersRef, where('universityRollNo', '==', identifierOrEmail.trim().toUpperCase()), limit(1))));

        const results = await Promise.all(lookups);
        const match = results.find(snap => !snap.empty)?.docs[0];
        if (match && match.data().email) {
          emailToUse = match.data().email.toLowerCase();
        } else {
          // Fallback to API if available
          const res = await fetch('/api/auth/student-login-identifier', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: identifierOrEmail })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.email) emailToUse = data.email.toLowerCase();
          }
        }
      } catch (err) {
        console.warn('Student identifier resolution error, trying email directly:', err);
      }
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      await loadUserProfile(cred.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setAdminProfile(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        adminProfile,
        isAdmin,
        loading,
        login,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
