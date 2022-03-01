import React, { Fragment } from 'react';
import Link from 'next/link';
import Header from './Header';
import { Global, css } from '@emotion/react';
import Head from 'next/head';

const Layout = props => {
  return ( 

    <Fragment>

      <Global 
        styles={css`
          :root {
            --gris: #3d3d3d;
            --gris2: #6f6f6f;
            --gris3: #e1e1e1;
            --naranja: #da552f;
          }

          html {
            font-size: 62.5%;
            box-sizing: border-box;
          }

          *, *:before, *:after {
            box-sizing: inherit;
          }

          body {
            font-size: 1.6rem; /** 16Px  */
            line-height: 1.5;
            font-family: 'PT Sans', sans-serif;
          }

          h1, h2, h3 {
            margin: 0 0 2rem 0;
            line-height: 1.5;
          }

          h1, h2 {
            font-family: 'Roboto Slaf', serif;
            font-weight: 700;
          }

          h3 {
            font-family: 'PT Sans', sans-serif;
          }

          ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }

          a {
            text-decoration: none;
          }

        `}
      />

      <Head>
        <title>Product Hunt, Firebase y Next.js</title>
      </Head>

      <Header />   

      <main>
        {props.children}
      </main>

    </Fragment>

   );
}
 
export default Layout;