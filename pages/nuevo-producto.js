import React, { Fragment, useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import { FirebaseContext } from '../firebase';
import { getFirestore , collection, addDoc } from "firebase/firestore";
import { getStorage , ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Error404 from '../components/layout/404';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';


const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  //imagen: '',
  url: '',
  descripcion: ''
}

export default function NuevoProducto() {

  //State de las imagenes
  const [ nombreImagen, guardarNombre ] = useState('');
  const [ subiendo, guardarSubiendo ] = useState(false);
  const [ progreso, guardarProgreso ] = useState(0);
  const [ urlImagen, guardarUrlImagen] = useState('');

  const [ error, guardarError ] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
  const { nombre, empresa, imagen, url, descripcion } = valores;

  //Hook de routing para redireccionar
  const router = useRouter();
  
  //Context con las operaciones CRUD de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  //Codigo para hacer funcionar File Uploader con Firebase v9
  const storage = getStorage(firebase.app);
  const refForUploader = ref(storage, "productos");
  refForUploader["child"] = function (filename) {
    const newRef = ref(this, filename)
    newRef["put"] = function (file, metadata) {
      return uploadBytesResumable(newRef, file, metadata)
    }
    return newRef
  }
  
  //Funcioes para subir imagenes
  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  } 
  
  const handleProgress = progreso => guardarProgreso({ progreso });

  const handleUploadError = error => {
      guardarSubiendo(error);
      console.error(error);
  };

  const handleUploadSuccess = nombre => {
      
      guardarProgreso(100);
      guardarSubiendo(false);
      guardarNombre(nombre);

      getDownloadURL(ref(storage, 'productos/' + nombre))
      .then((url) => {
        console.log(url);
        guardarUrlImagen(url);
      })
      .catch((error) => {
        console.log('Error getDoenloadUrl ' + error);
      });

      
  };

  async function crearProducto() {

    //Si no hay usuario logeado llevar al login  
    if(!usuario) {
      return router.push('/login');
    }

    //Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    //Insertar en la bd
    const db = getFirestore();
    try {
      const docRef = await addDoc(collection(db, "productos"), producto);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  
    return router.push('/');

  }

  return (

    <div>
      <Layout>

        { !usuario ? <Error404 /> 
        : 
        (
          <Fragment>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1>        

            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >

              <fieldset>
                
                <legend>Información General</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input  
                    type="text"
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                { errores.nombre && <Error>{errores.nombre}</Error> }


                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input  
                    type="text"
                    id="empresa"
                    placeholder="Nombre Empresa o Compañía"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                { errores.empresa && <Error>{errores.empresa}</Error> }


                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader  
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    /*value={imagen}
                    onChange={handleChange}
                    onBlur={handleBlur}*/
                    randomizeFilename
                    //storageRef={firebase.storage.ref("productos")}
                    storageRef={refForUploader}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                {/* errores.imagen && <Error>{errores.imagen}</Error> */} 


                <Campo>
                  <label htmlFor="url">Url</label>
                  <input  
                    type="url"
                    id="url"
                    name="url"
                    placeholder='URL de tu producto'
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                { errores.url && <Error>{errores.url}</Error> }

              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea  
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                { errores.descripcion && <Error>{errores.descripcion}</Error> }


              </fieldset>

              <InputSubmit 
                type="submit"
                value="Crear Producto"
              />
              

            </Formulario>
          </Fragment>
        )
        
        }

 
      </Layout>
    </div>
  )

}
