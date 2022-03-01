import { getApps, initializeApp } from 'firebase/app';
import firebaseConfig from './config';
import { getAuth, createUserWithEmailAndPassword, updateProfile , signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

class Firebase {

  constructor() {
    if (!getApps().length) {
      this.app  = initializeApp(firebaseConfig);
    }
    this.auth = getAuth();
    this.db   = getFirestore();
    this.storage = getStorage(this.app);
  }

  //Registra un usuario
  async registrar(nombre, email, password) {

    console.log('Entra a registrar...');
   
    await createUserWithEmailAndPassword(this.auth, email, password)
    .then( () => {   return updateProfile(nombre, { displayName: nombre }); })
    .catch((error) => {
      throw error;
    });

  }

  //Inicia sesion del usuario
  async login(email, password) {

    await signInWithEmailAndPassword(this.auth, email, password)
    .then( (userCredential) => { 
      return console.log(userCredential);
    })
    .catch((error) => {
      throw error;
    });

  }

  //Cerrar sesión del usuario
  cerrarSesion() {

    const auth = getAuth();
    signOut(auth)
    .catch((error) => {
      reject(error);
    });

  }

}

const firebase = new Firebase();
export default firebase;