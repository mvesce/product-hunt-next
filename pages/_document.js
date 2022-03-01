
import { Html, Head, Main, NextScript } from 'next/document';
import firebase, { FirebaseContext } from '../firebase';

export default function Document() {
  return (
    <Html>
      <Head>
        <html lang="es" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <body>
        <Main />
        <NextScript />
        <FirebaseContext.Provider />
      </body>
      
    </Html>
  )
}