import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import createCarritoMesh from './carrito.js';
import createTrail from './rollerCoaster.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.x = 100;
camera.position.y = 30;
camera.position.z = 50;
camera.lookAt(scene.position);

const renderer =  new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera,renderer.domElement);
controls.screenSpacePanning=true;

// Defino elementos de la escena

var ambienLight=new THREE.AmbientLight(0x222222);
scene.add(ambienLight);

var light1 = new THREE.PointLight(0xFFFFAA, 1);
light1.position.set(300.0,300.0,150.0);
scene.add(light1);

var light2 = new THREE.PointLight(0xAAFFFF, 1);
light2.position.set(-300.0,300.0,-150.0);
scene.add(light2);


var gridHelper = new THREE.GridHelper( 100,10 );
scene.add( gridHelper );

var axesHelper = new THREE.AxesHelper( 8 );
scene.add( axesHelper );

const trail = createTrail(false).trail;
scene.add(trail);

//const carritoMesh = createCarritoMesh.createCarritoMesh();
//scene.add(carritoMesh);


document.body.appendChild(renderer.domElement);
renderer.render( scene, camera );

let up = new THREE.Vector3( 0, 1, 0 );
let axis = new THREE.Vector3( );
let pt, radians, tangent;
let t = 0;

animate();

function animate() {
	requestAnimationFrame( animate );
    
	renderer.render( scene, camera);
    //render();
}

function render() {
// set the marker position
    pt = trailPath.getPoint( t );

    // set the marker position
    carritoMesh.position.set( pt.x, pt.y, pt.z );

    // get the tangent to the curve
    tangent = trailPath.getTangent( t ).normalize();

    // calculate the axis to rotate around
    axis.crossVectors( up, tangent ).normalize();

    // calcluate the angle between the up vector and the tangent
    radians = Math.acos( up.dot( tangent ) );

    // set the quaternion
    carritoMesh.quaternion.setFromAxisAngle( axis, radians );

    t = (t >= 1) ? 0 : t += 0.002;

	renderer.render( scene, camera);
}
