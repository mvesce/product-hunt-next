import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

export default function Buscar() {

  const router = useRouter();
  const {query: {q} } = router;
  
  //Todos los productos
  const { productos } = useProductos('creado');
  const [ resultado, guardarResultado ] = useState([]);

  useEffect( () => {

    const busqueda = q.toLocaleLowerCase();
    const filtro = productos.filter(producto => {
      return (
        producto.nombre.toLocaleLowerCase().includes(busqueda) ||
        producto.descripcion.toLocaleLowerCase().includes(busqueda) 
      );
    })
    guardarResultado(filtro);

  }, [q, productos]);

  return (
    <div>

      <Layout>
      
        <div className='listado-productos'>
          <div className='contenedor'>
            <div className='bg-white'>
              {resultado.map( producto => (
                <DetallesProducto 
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </div>
          </div>
        </div>

      </Layout>

    </div>
  )
}