// src/contexts/auth-context.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Import the Firebase auth instance
import {
  onAuthStateChanged, // Used to observe authentication state changes
  signOut, // Used for logging out
  signInWithEmailAndPassword, // Used for email/password login
  createUserWithEmailAndPassword, // Used for email/password signup
  sendPasswordResetEmail, // Used for sending password reset emails
  AuthError, // Firebase auth error type
} from 'firebase/auth';

interface User {
  uid: string; // Use uid from FirebaseUser
  email: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Manages loading state during auth checks
  const router = useRouter();

  useEffect(() => {
    // Firebase's onAuthStateChanged listener handles real-time auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Authentication state has been determined
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Firebase's signInWithEmailAndPassword handles persistence automatically
      // based on the browser's capabilities and user's choice.
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged listener will update user and isAuthenticated state
      router.push('/home'); // Redirect to home page after successful login
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error("Firebase Login Error:", authError.code, authError.message);
      // Provide a more user-friendly error message based on Firebase error codes
      let errorMessage = "Failed to login. Please check your credentials.";
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (authError.code === 'auth/too-many-requests') {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged listener will update user and isAuthenticated state
      router.push('/home'); // Redirect to home page after successful signup and auto-login
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error("Firebase Signup Error:", authError.code, authError.message);
      let errorMessage = "Failed to sign up. Please try again.";
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use.";
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. It must be at least 6 characters.";
      }
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error("Firebase Password Reset Error:", authError.code, authError.message);
      let errorMessage = "Failed to send reset link. Please try again.";
      if (authError.code === 'auth/user-not-found') {
        errorMessage = "No account found with that email address.";
      }
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged listener will update user and isAuthenticated state
      router.push('/login'); // Redirect to login page after logout
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error("Firebase Logout Error:", authError.code, authError.message);
      throw new Error("Failed to log out.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, resetPassword, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};