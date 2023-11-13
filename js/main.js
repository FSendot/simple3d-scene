import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Geometries from './basicGeometries.js';
import * as FlyingChairs from './flyingChairs.js';
import * as RollerCoaster from './rollerCoaster.js';

const scene = new THREE.Scene();

// Most camera definitions
const rollerCoasterCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
rollerCoasterCamera.position.set(200, 300, 400);
rollerCoasterCamera.lookAt(scene.position);

const genericCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
genericCamera.position.set(300, 300, 300);
genericCamera.lookAt(scene.position);


let currentCamera = genericCamera;

const renderer =  new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(genericCamera, renderer.domElement);
controls.screenSpacePanning=true;

// Defino elementos de la escena
const ambienLight=new THREE.AmbientLight(0x222222);
scene.add(ambienLight);

const light1 = new THREE.PointLight(0xFFFFAA, 1);
light1.position.set(300.0,300.0,150.0);
scene.add(light1);

const light2 = new THREE.PointLight(0xAAFFFF, 1);
light2.position.set(-300.0,300.0,-150.0);
scene.add(light2);

const gridHelper = new THREE.GridHelper( 100,10 );
scene.add( gridHelper );

const axesHelper = new THREE.AxesHelper( 8 );
scene.add( axesHelper );

// Roller Coaster stuff
/*
RollerCoaster.createTrail(true, 10);
scene.add(RollerCoaster.trail);
scene.add(RollerCoaster.carrito);
*/

scene.add(FlyingChairs.createFlyingChairs(10, 70));

document.body.appendChild(renderer.domElement);

animate();

function animate() {
	requestAnimationFrame( animate );
    
    // Every Animation should be called here
    //RollerCoaster.animate();

	renderer.render( scene, currentCamera );
}
