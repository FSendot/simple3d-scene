import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import createCarritoMesh from './carrito.js';

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

let trailShape = new THREE.Shape();
trailShape.moveTo(0,0);
trailShape.bezierCurveTo(0,0, 0,-1, 0,-2);
trailShape.bezierCurveTo(2.5,-2, 2.5,-4, 5,-4);
trailShape.bezierCurveTo(7.5,-4, 7.5,-2, 10,-2);
trailShape.bezierCurveTo(10,-2, 10,-2, 10,0);
trailShape.bezierCurveTo(10,0, 10.25,0, 10.5,0);
trailShape.bezierCurveTo(10.7,0, 10.9, -0.25, 11,-0.5);
trailShape.bezierCurveTo(11,-1, 11, -3, 11,-4);
trailShape.bezierCurveTo(8,-4, 8, -10, 5,-10);
trailShape.bezierCurveTo(2,-10, 2, -4, -1,-4);
trailShape.bezierCurveTo(-1,-3, -1, -2, -1,-0.5);
trailShape.bezierCurveTo(-1,-0.25, -1, 0, -0.5,0);
trailShape.bezierCurveTo(-0.5,0, -0.2, 0, 0,0);
const trailShapePoints = trailShape.extractPoints(50);
trailShapePoints.shape.forEach( e => {
    e.rotateAround( new THREE.Vector2(0,0), Math.PI/2);
    e.setY(e.y-5);
    e.setX(e.x-5);
});
trailShape = new THREE.Shape(trailShapePoints.shape);

//Create a closed wavey loop
const trailSegment1 = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 8, 170, 25 ),
    new THREE.Vector3( 55, 225, 75 ),
    new THREE.Vector3( 55, 150, 180 ),
    new THREE.Vector3( 55, 140, 180 ),
    new THREE.Vector3( 60, 55, 140 ),
    new THREE.Vector3( 60, 0, 0 ),
    new THREE.Vector3( 50, -55, -140 ),
    new THREE.Vector3( 40, -140, -180 ),
    new THREE.Vector3( 30, -150, -180 ),
    new THREE.Vector3( 20, -225, -75 ),
    new THREE.Vector3( 2, -170, -25 ),
    new THREE.Vector3( 0, 0, 0 ),
], false, 'chordal')
const trailPath1 = new THREE.CurvePath();
trailPath1.add(trailSegment1);
trailPath1.closePath();
const trail1ExtrudeSettings = {
    curveSegments: 50,
    steps: 100,
    bevelEnabled: false,
    extrudePath: trailPath1,
};

//Create a closed wavey loop
const trailSegment2 = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 60, 0 ),
    new THREE.Vector3( 0, 120, 0 ),
    new THREE.Vector3( 55, 210, 0 ),
    new THREE.Vector3( 60, 240, 190 ),
    new THREE.Vector3( 60, 225, 158 ),
    new THREE.Vector3( 40, 155, 190 ),
    new THREE.Vector3( 40, 0, 170 ),
    new THREE.Vector3( 20, 0, 120 ),
    new THREE.Vector3( 20, 0, 60 ),
    new THREE.Vector3( 0, 0, 30 ),
    new THREE.Vector3( 0, 0, 0 ),
], false, 'chordal')
const trailPath2 = new THREE.CurvePath();
trailPath2.add(trailSegment2);
trailPath2.autoClose = true;
const trail2ExtrudeSettings = {
    curveSegments: 50,
    steps: 100,
    bevelEnabled: false,
    extrudePath: trailPath2,
};


const trail1Geometry = new THREE.ExtrudeGeometry(trailShape, trail2ExtrudeSettings);
trail1Geometry.rotateZ(Math.PI/2);
//const trail1Geometry = new THREE.ShapeGeometry(trailShape);
const trailMesh = new THREE.Mesh(trail1Geometry, new THREE.MeshBasicMaterial( { color: 0xe47200 } ));
scene.add(trailMesh);
//const carritoMesh = createCarritoMesh();
//scene.add(carritoMesh);


document.body.appendChild(renderer.domElement);
renderer.render( scene, camera );

animate();

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera, false, false );
}

