import * as THREE from 'three';
import createCarritoMesh from './carrito.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.x = 30;
camera.position.y = 30;
camera.position.z = 30;
camera.lookAt(scene.position);

const renderer =  new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);

const carritoMesh = createCarritoMesh();
scene.add(carritoMesh);


document.body.appendChild(renderer.domElement);
renderer.render( scene, camera );

//animate();

function animate() {
	requestAnimationFrame( animate );

	carritoMesh.rotation.x += 0.01;
	carritoMesh.rotation.y += 0.01;

	renderer.render( scene, camera );
}

