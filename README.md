# Building del Proyecto

Es necesario tener NodeJS y npm instalado en el equipo de prueba, no porque sea necesario descargar paquetes, pero será necesario para poder ejecutar el entorno de Vite con NodeJS. Sin NodeJS eso no sería posible.

Con seguir los pasos para descritos en el siguiente link: https://threejs.org/docs/index.html#manual/en/introduction/Installation debería ser suficiente.

El proyecto se encontrará zipeado (sin contraseña), sólo será necesario descomprimirlo y correr dentro de la carpeta del proyecto:
$>  npx vite

Si este proyecto se accedió mediante un clone de algún repositorio remoto, será necesario antes también correr el siguiente comando:
$> npm install

Una vez que inicie Vite, se inicializará un servidor local en el que correrá el proyecto y será accesible mediante un URL provisto por Vite en la terminal.
Cualquier cambio en los fuentes de JS se verá instantáneamente reflejado en el browser debido al Hot Reload provisto por Vite.

Ante cualquier dificultad con el acceso al proyecto desde el .zip, clonar del respositorio de GitHub con el siguiente comando:
$> git clone https://github.com/FSendot/simple3d-scene
