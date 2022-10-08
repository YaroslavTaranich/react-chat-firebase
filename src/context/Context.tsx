import { FirebaseApp, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { collection, CollectionReference, DocumentData, Firestore, getFirestore } from 'firebase/firestore'
import { createContext } from 'react'

const firebaseConfig = {
  apiKey: 'AIzaSyD4x3FiDSePnq5T12M0xv_Qgah666Yi-WQ',
  authDomain: 'chat-react-b6f77.firebaseapp.com',
  projectId: 'chat-react-b6f77',
  storageBucket: 'chat-react-b6f77.appspot.com',
  messagingSenderId: '510895684314',
  appId: '1:510895684314:web:7af4a536ac8d51b40783e3',
  measurementId: 'G-35F58TX2LY',
}

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig)
export const auth = getAuth(firebase)
export const firestore = getFirestore(firebase)

export function createCollection<T = DocumentData>(collectionName: string) {
  return collection(firestore, collectionName) as CollectionReference<T>
}

export interface IContext {
  firebase: FirebaseApp
  auth: Auth
  firestore: Firestore
}

export const value = {
  firebase,
  auth,
  firestore,
}

export const Context = createContext<IContext>(value)
