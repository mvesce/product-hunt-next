export default function validarCrearProducto(valores) {

  let errores = {};

  //Validar nombre
  if(!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }

  //Validar empresa
  if(!valores.empresa) {
    errores.empresa = "Nombre de la empresa es obligatorio";
  }

  //Validar url
  if(!valores.url) {
    errores.url = 'La URL del producto es obligatoria'
  } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
    errores.url = 'URL no válida'
  }

  //Validar descripcion
  if(!valores.descripcion) {
    errores.descripcion = "Agrega una descripción de tu producto";
  }

  return errores;

}