import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAFNbnkTVgZnGijrTqmUJQqmZCeLk96q5E",
    authDomain: "shift-management-caa00.firebaseapp.com",
    projectId: "shift-management-caa00",
    storageBucket: "shift-management-caa00.firebasestorage.app",
    messagingSenderId: "581392732257",
    appId: "1:581392732257:web:c48a7c4890b27dffc75a20",
    measurementId: "G-LCPW650M2W"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
