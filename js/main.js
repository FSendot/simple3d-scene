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
genericCamera.position.set(-400, 200, -500);
genericCamera.lookAt(scene.position);


let currentCamera = genericCamera;

const renderer =  new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(genericCamera, renderer.domElement);
controls.screenSpacePanning=true;

const floor = new THREE.Mesh( 
    new THREE.PlaneGeometry(10000, 10000), 
    new THREE.MeshPhysicalMaterial({ 
        color: 0xffff00,
        ior: 1.5,
        reflectivity: 0.5,
        iridescenceIOR: 1.3,
        specularIntensity: 1
    })
);
floor.rotateX(1.5 * Math.PI);
scene.add(floor);

// Defino elementos de la escena
const ambienLight=new THREE.AmbientLight(0xFFFFFF);
scene.add(ambienLight);

const light1 = new THREE.PointLight(0xFFFFFF, 1);
light1.position.set(300.0,300.0,150.0);
light1.lookAt(scene.position)
scene.add(light1);

const light2 = new THREE.PointLight(0xFFFFFF, 1);
light2.position.set(-300.0,300.0,-150.0);
light2.lookAt(scene.position)
scene.add(light2);

const gridHelper = new THREE.GridHelper( 100,10 );
scene.add( gridHelper );

const axesHelper = new THREE.AxesHelper( 8 );
scene.add( axesHelper );

// Roller Coaster stuff

RollerCoaster.createTrail(true, 15);
scene.add(RollerCoaster.trail);
scene.add(RollerCoaster.carrito);

FlyingChairs.createFlyingChairs(10, 60)
scene.add(FlyingChairs.flyingChairs);

document.body.appendChild(renderer.domElement);

animate();

function animate() {
	requestAnimationFrame( animate );
    
    // Every Animation should be called here
    RollerCoaster.animate();
    FlyingChairs.animate();

	renderer.render( scene, currentCamera );
}
