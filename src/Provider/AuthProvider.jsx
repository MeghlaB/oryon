import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";


import { auth } from "../Firebase/firebase.config";

export const AuthContext = createContext(null);


const provider = new GoogleAuthProvider();
const hello  = 'Nothings here'
function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // CreateUser
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  // user-SignIn user
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // user-logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // update photo
  const updateUserprofile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name, photoURL: photo
    })

  }
  // Google_login
  const GoogleLogin = () => {
    setLoading(true)
    return signInWithPopup(auth, provider)
  }

  // onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
    });

    return () => unsubscribe();
  }, []);



  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    updateUserprofile,
    GoogleLogin
  };
  return (
    <AuthContext.Provider value={authInfo}>
      {children}
      {/* {loading ? (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-accent">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    ) : (
      children
    )} */}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
