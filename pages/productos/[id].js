/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, Fragment, useContext } from 'react';
import { useRouter } from 'next/router';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';
import { FirebaseContext } from '../../firebase';

const ContenedorProducto = styled.div`
  @media (min-width:768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #DA552F;
  color: #FFF;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const ImagenProducto = styled.img`
  height: auto;
  border-radius: 8px;
  max-width: 100%;
`;

const Producto = (props) => {

  //State componente
  const [ producto, guardarProducto ] = useState({});
  const [ error, guardarError ] = useState(false);
  const [ comentario, guardarComentario ] = useState({});
  const [ consultarDB, guardarConsultarDB ] = useState(true);

  //Context
  const { usuario } = useContext(FirebaseContext);

  //Routing para obtener ID actual
  const router = useRouter();
  const { query: { id } } = router;

  useEffect( () => {

    if(id && consultarDB) {

      const obtenerProducto = async () => {
        
        const db = getFirestore();
        const docRef = doc(db, "productos", id);
        const producto = await getDoc(docRef);
        
        if (producto.exists()) {
          guardarProducto(producto.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
        console.log('Print producto');
      }
      obtenerProducto();

    }
 
  }, [id]);

  const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado } = producto;

  if(Object.keys(producto).length === 0 && !error) return 'Cargando...';

  //Administrar y validar los votos
  const votarProducto = async () => {

    if(!usuario) {
      return router.push('/login');
    }

    //Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Verificar si el usuario actual ha votado
    if(haVotado.includes(usuario.uid)) {
      return null;
    }

    //Guardar del ID del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //Actualizar en la BD
    const db = getFirestore();
    const productosRef = doc(db, "productos", id);

    await updateDoc(productosRef, {
      votos: nuevoTotal,
      haVotado: nuevoHaVotado
    });

    //Actualizar state
    guardarProducto({
      ...producto,
      votos: nuevoTotal
    });

    //Hay voto, consultar DB
    guardarConsultarDB(true);
  }

  //Funciones para crear comentarios
  const comentarioChange = e => {
    guardarComentario({
      ...comentario,
      [e.target.name] : e.target.value
    });
  }

  //Identifica si el comentario es del creador del producto
  const esCreador = id => {
    if(creador.id == id) {
      return true;
    }
  }

  //Agregar el comentario
  const agregarComentario = async e => {
    e.preventDefault();

    if(!usuario) {
      return router.push('/login');
    }

    //Información extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;
    
    //Tomar copia de comentarios y agregar al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar la BD
    const db = getFirestore();
    const productosRef = doc(db, "productos", id);

    await updateDoc(productosRef, {
      comentarios: nuevosComentarios
    });

    //Actualizar el state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    //Actualizar comentarios
    guardarComentario({
      mensaje: '',
      usuarioId: '',
      usuarioNombre: ''
    });
    e.target.reset();

    //Hay comentario, consultar DB
    guardarConsultarDB(true);
  }

  //Funcion que revisa que el creador del producto sea el mismo autenticado
  const puedeBorrar = () => {
    if(!usuario) {
      return false;
    }
      
    if(creador.id === usuario.uid) {
      return true;
    }
  }

  //Elimina un producto de la BD
  const eliminarProducto = async () => {

    //Si no está logeado o es usuario distinto
    if(!usuario) {
      return router.push('/login');
    }
      
    if(creador.id !== usuario.uid) {
      return router.push('/');
    }


    try {

      const db = getFirestore();
      await deleteDoc(doc(db, "productos", id));
      router.push('/');

    } catch (error) {
      console.log(error);
    }


  }

  return ( 

    <Layout>

      <Fragment>
        { error 
        ? <Error404 /> 
        : 
        (
          <div className='contenedor'>
            <h1 
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>

            <ContenedorProducto>

              <div>
                <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale: es})}</p>
                <p>Por {creador.nombre} de {empresa}</p>
                <ImagenProducto src={urlImagen} alt={descripcion} />
                <p>{descripcion}</p>

                { usuario && (

                  <Fragment>
                    <h2>Agrega tu comentario</h2>
                    <form
                      onSubmit={agregarComentario}
                    >
                      <Campo>
                        <input 
                          type="text"
                          name="mensaje" 
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit
                        type="submit"
                        value="Agregar Comentario"
                      />  

                    </form>
                  </Fragment>

                )}

                <h2 css={css`
                  margin: 2rem 0;
                `}>Comentarios</h2>

                {comentarios.length === 0 
                ? 'Aún no hay comentarios' 
                :
                (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li 
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>Escrito por:{' '}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >{comentario.usuarioNombre}</span>
                        </p>
                        {esCreador(comentario.usuarioId) 
                        &&  <CreadorProducto>Es Creador</CreadorProducto>
                        }
                      </li>
                    ))}
                  </ul>
                )
                }



              </div>

              <aside>
                <Boton
                  target="_blank"
                  bgColor="true"
                  href={url}
                >
                  Visitar URL
                </Boton>

                { usuario && (
                  <Boton
                    onClick={votarProducto}
                  >
                    Votar
                  </Boton>
                )}

                <p css={css`
                  text-align: center;
                `}>{votos} Votos</p>
              </aside>

            </ContenedorProducto>

            { puedeBorrar() && 
              <Boton
                onClick={eliminarProducto}
              >
                Eliminar Producto
              </Boton> 
            }

          </div>
        )
        }
      </Fragment>

      
    </Layout>
    
   );
}
 
export default Producto;