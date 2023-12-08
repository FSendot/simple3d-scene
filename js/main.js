import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import * as Geometries from './basicGeometries.js';
import * as FlyingChairs from './flyingChairs.js';
import * as RollerCoaster from './rollerCoaster.js';

const scene = new THREE.Scene();
const gui = new GUI();
const loader = new THREE.TextureLoader();

let phi = 0;
let cameras = [];
let index = 0;

// Most camera definitions
const rollerCoasterCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 7000);
rollerCoasterCamera.position.set(-400, 300, -500);
rollerCoasterCamera.lookAt(scene.position);
cameras.push(rollerCoasterCamera);

const genericCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 7000);
genericCamera.position.set(-200, 100, -200);
genericCamera.lookAt(scene.position);

const flyingChairsCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 7000);
flyingChairsCamera.position.set(-50, 150, -150);
flyingChairsCamera.lookAt(-400, 50, -500);
cameras.push(flyingChairsCamera);

const cenytalCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 7000);
cenytalCamera.position.set(-700, 500, -700);
cenytalCamera.lookAt(scene.position);
cameras.push(cenytalCamera)
const cenytalCameraGroup = new THREE.Group().add(cenytalCamera);

const controlledCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 7000);
controlledCamera.position.set(100, 10, 100);
controlledCamera.lookAt(scene.position);
cameras.push(controlledCamera);

cameras.push(RollerCoaster.passengerCamera);

let currentCamera = controlledCamera;

const renderer =  new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(genericCamera, renderer.domElement);
controls.screenSpacePanning=true;

const keyboardControls = new FlyControls( controlledCamera, renderer.domElement );
keyboardControls.movementSpeed = 100;
keyboardControls.rollSpeed = Math.PI / 24;
keyboardControls.autoForward = false;
keyboardControls.dragToLook = true;

// Sky and floor
const pasto = loader.load("./../maps/pasto.jpg", (pasto) => {
    pasto.wrapS = pasto.wrapT = THREE.RepeatWrapping;
    pasto.anisotropy = 16;
    pasto.colorSpace = THREE.SRGBColorSpace;
    pasto.repeat.set(100, 100);
});
const tierra = loader.load("./../maps/tierra.jpg", (tierra) => {
    tierra.wrapS = tierra.wrapT = THREE.RepeatWrapping;
    tierra.anisotropy = 16;
    tierra.colorSpace = THREE.SRGBColorSpace;
    tierra.repeat.set(100, 100);
    renderer.copyTextureToTexture(new THREE.Vector2(0.5, 0), tierra, pasto, 1);
});

const tierraSeca = loader.load("./../maps/tierraseca.jpg", (tierraSeca) => {
    tierraSeca.wrapS = tierraSeca.wrapT = THREE.RepeatWrapping;
    tierraSeca.anisotropy = 16;
    tierraSeca.colorSpace = THREE.SRGBColorSpace;
    tierraSeca.repeat.set(100, 100);
    renderer.copyTextureToTexture(new THREE.Vector2(0, 0.5), tierraSeca, pasto, 1);
});

const floorMaterial = new THREE.MeshPhongMaterial({ 
    map: pasto,
    reflectivity: 0,
    specular: 0, 
    shininess: 30,
});
const floor = new THREE.Mesh( 
    new THREE.PlaneGeometry(10000, 10000), 
    floorMaterial
);
floor.rotateX(1.5 * Math.PI);

const skyTexture = loader.load("./../maps/sunset.jpg", (skyTexture) => {
    skyTexture.wrapS = skyTexture.wrapT = THREE.RepeatWrapping;
    skyTexture.anisotropy = 256;
    skyTexture.repeat.set(1, 1);
});
const skyMaterial = new THREE.MeshPhongMaterial({ 
    map: skyTexture,
    reflectivity: 0,
    specular: 0, 
    shininess: 100000,
});
const sky = new THREE.Mesh(
    new THREE.SphereGeometry(5000, 64, 32, 0, Math.PI * 2, 1.7, Math.PI * 1.55),
    skyMaterial
);
sky.rotateZ(Math.PI);

scene.add(floor);
scene.add(sky);

// Lanterns
const lamp1 = Geometries.createLantern();
lamp1.position.set(100, 0, -100);
scene.add(lamp1);

const lamp2 = Geometries.createLantern();
lamp2.position.set(-100, 0, 100);
scene.add(lamp2);

const lamp3 = Geometries.createLantern();
lamp3.position.set(250, 0, -300);
scene.add(lamp3);

const lamp4 = Geometries.createLantern();
lamp4.position.set(-80, 0, -400);
scene.add(lamp4);

const lamp5 = Geometries.createLantern();
lamp5.position.set(-500, 0, 100);
scene.add(lamp5);

// Light
const ambienLight=new THREE.AmbientLight(0xFFFFFF);
scene.add(ambienLight);

    
/*
const light1 = new THREE.PointLight(0xFFFFFF, 1);
light1.position.set(300.0,300.0,150.0);
light1.lookAt(scene.position)
scene.add(light1);

const light2 = new THREE.PointLight(0xFFFFFF, 1);
light2.position.set(-300.0,300.0,-150.0);
light2.lookAt(scene.position)
scene.add(light2);
*/
//const gridHelper = new THREE.GridHelper( 100,10 );
//scene.add( gridHelper );

//const axesHelper = new THREE.AxesHelper( 8 );
//scene.add( axesHelper );

// Roller Coaster stuff
RollerCoaster.createTrail(true, 15);
scene.add(RollerCoaster.trail);
scene.add(RollerCoaster.carrito);

// Flying Chairs stuff
FlyingChairs.createFlyingChairs(10, 60)
scene.add(FlyingChairs.flyingChairs);

// Dat.GUI stuff
let rollerCoasterProps = { 
    isFirstTrail: true,
    rollerCoasterColumns: 15
};
const rollerCoasterFolder = gui.addFolder('Montaña Rusa');
rollerCoasterFolder
    .add(rollerCoasterProps, 'isFirstTrail' )
    .name('Perfil')
    .onChange(value => {
        RollerCoaster.createTrail(value, rollerCoasterProps.rollerCoasterColumns);
        scene.add(RollerCoaster.trail)
    });
rollerCoasterFolder
    .add(rollerCoasterProps, 'rollerCoasterColumns', 5, 30, 1)
    .name('Cantidad de Columnas')
    .onChange(value => {
        RollerCoaster.createTrail(rollerCoasterProps.isFirstTrail, value);
        scene.add(RollerCoaster.trail);
    });

let flyingChairsProps = {
    height: 70.0,
    chairsAmount: 15
};
const flyingChairsFolder = gui.addFolder('Sillas Voladoras');
flyingChairsFolder
    .add(flyingChairsProps, 'height', 50.0, 150.0, 0.1)
    .name('Altura')
    .onChange(value => {
        scene.remove(FlyingChairs.flyingChairs);
        FlyingChairs.createFlyingChairs(flyingChairsProps.chairsAmount, value);
        scene.add(FlyingChairs.flyingChairs);
    });
flyingChairsFolder
    .add(flyingChairsProps, 'chairsAmount', 5, 30, 1)
    .name('Sillas')
    .onChange(value => {
        scene.remove(FlyingChairs.flyingChairs);
        FlyingChairs.createFlyingChairs(value, flyingChairsProps.height);
        scene.add(FlyingChairs.flyingChairs);
    });

document.body.appendChild(renderer.domElement);
setupKeyControls();
animate();

function animate() {
	requestAnimationFrame( animate );
    
    // Every Animation should be called here
    RollerCoaster.animate();
    FlyingChairs.animate();
    cenytalCameraGroup.rotateY(0.0008)
    cenytalCamera.lookAt(scene.position);
    
    phi += 0.0005;
    if(phi > Math.PI * 2){
        phi = 0;
    }
    keyboardControls.update(0.01)
	renderer.render( scene, currentCamera );
}


function setupKeyControls() {
    document.onkeydown = function (evento) {
        if(index >= cameras.length){
            index = 0;
        }
        switch (evento.key) {
            case 'c':
                currentCamera = cameras[index++];
                break;
        }
    };
}
