// Firebase configuration
// This file should be populated with your Firebase project config
// You can find this in Firebase Console > Project Settings > General > Your apps

// For now, this will be set via environment variables or localStorage
// The dashboard will try to read from window.FIREBASE_CONFIG or localStorage

window.FIREBASE_CONFIG = window.FIREBASE_CONFIG || (() => {
  // Try to get from localStorage
  const stored = localStorage.getItem('FIREBASE_CONFIG');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Invalid FIREBASE_CONFIG in localStorage');
    }
  }
  
  // Default config
  return {
    apiKey: "AIzaSyDVVI4qv9SV_TlU6-75q0ujszivVZ0zNm4",
    authDomain: "qapipeline-7c83d.firebaseapp.com",
    projectId: "qapipeline-7c83d",
    storageBucket: "qapipeline-7c83d.firebasestorage.app",
    messagingSenderId: "692862365583",
    appId: "1:692862365583:web:fe5ca43e30a9d4d01025fa",
    measurementId: "G-449FT5J8VJ"
  };
})();

