import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as authSignOut } from 'firebase/auth';
import { auth, app } from './firebase';
import { getDatabase, ref as dbRef, get } from 'firebase/database';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChanged = async (authStateUser) => {
    setIsLoading(true);
    if (!authStateUser) {
      clear();
      return;
    }
  
    const db = getDatabase(app);
    const userRef = dbRef(db, `users/${authStateUser.uid}`);
    
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dbUser = snapshot.val();
        setAuthUser({
          uid: authStateUser.uid,
          email: authStateUser.email,
          photoURL: dbUser.photoURL || authStateUser.photoURL, 
          firstName: dbUser.firstName,
          lastName: dbUser.lastName, 
        });
      } else {
    
        setAuthUser({
          uid: authStateUser.uid,
          email: authStateUser.email,
          photoURL: authStateUser.photoURL, 
          firstName: '', 
          lastName: '', 
        });
      }
      setIsLoading(false);
    }).catch(error => {
      console.error("Error fetching user details:", error);
      setIsLoading(false);
    });
  }; 

  const signOut = () => authSignOut(auth).then(clear);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
    
  }, []);

  return {
    authUser,
    isLoading,
    signOut
  };
}

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
  signOut: async () => {}
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
}

export const useAuth = () => useContext(AuthUserContext);