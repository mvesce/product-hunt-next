import React, {useState, useEffect, useContext} from 'react';
import { getFirestore, query, collection, orderBy, getDocs } from "firebase/firestore";

const useProductos = orden => {

  const [ productos, guardarProductos ] = useState([]);
  
  useEffect( () => {
  
    const obtenerProductos = async () => {
  
      const db = getFirestore();
      const q = query(collection(db, "productos"), orderBy(orden, "desc"));
      const querySnapshot = await getDocs(q);
  
      const productos = querySnapshot.docs.map((doc) => { return { id: doc.id, ...doc.data() }; });
  
      guardarProductos(productos);
  
    }
    obtenerProductos();
  
  }, []);

  return {
    productos
  }

}

export default useProductos;