import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyC7xhyuJsuQpg7pfmSMa4q8EpXztif1tjY',
    authDomain: 'quickcourt-a86f0.firebaseapp.com',
    projectId: 'quickcourt-a86f0',
    storageBucket: 'quickcourt-a86f0.firebasestorage.app',
    messagingSenderId: '918334800920',
    appId: '1:918334800920:ios:482baee0d35a9a91766f6d',
};

const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);