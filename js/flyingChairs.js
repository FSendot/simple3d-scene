import * as THREE from 'three';
import * as Geometries from './basicGeometries.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let cableChairs = [];
let chairsAndDiscGroup, chairsGroup, flyingChairs, mainRotatingGroup;

let discHeight;

let x = 0.0;
let xSign = 1;

let z = 0.0;
let zSign = 1;

let t = 0;
let step = 0.000001;
let centrifugalStep = Math.PI/6 * (step / 0.008) * -1;

const loader = new THREE.TextureLoader();
const mainCylinderTexture = loader.load("./../maps/patron1.png");
mainCylinderTexture.wrapS = mainCylinderTexture.wrapT = THREE.RepeatWrapping;
mainCylinderTexture.anisotropy = 16;
mainCylinderTexture.colorSpace = THREE.SRGBColorSpace;
mainCylinderTexture.repeat.set(0.98, mainCylinderTexture.repeat.y);

const discTexture = loader.load("./../maps/patron3.png");
const sideDiscTexture = discTexture.clone();

discTexture.wrapS = THREE.RepeatWrapping;
discTexture.mapping = THREE.EquirectangularRefractionMapping;
discTexture.repeat.set(2, 6.4/8);
discTexture.anisotropy = 16;

sideDiscTexture.wrapT = THREE.MirroredRepeatWrapping;
sideDiscTexture.wrapS = THREE.RepeatWrapping;
sideDiscTexture.anisotropy = 32;
sideDiscTexture.center.set(1, 1.07);
sideDiscTexture.repeat.set(2, 1.0/7.9);

function createFlyingChairs( chairsAmount = 10, height = 70.0 ){
    if(!Number.isInteger(chairsAmount) || chairsAmount < 1){
        chairsAmount = 5;
    }
    if(Number.isNaN(height) || height < 50.0){
        discHeight = 70.0;
    } else{
        discHeight = height;
    }
    chairsAndDiscGroup = new THREE.Group();
    chairsGroup = new THREE.Group();
    flyingChairs = new THREE.Group();
    mainRotatingGroup = new THREE.Group();

    cableChairs = [];
    t = 0;
    z = 0;
    x = 0;

    mainCylinderTexture.repeat.set(mainCylinderTexture.repeat.x, height / 90.0);
    const mainCylinderMaterial = new THREE.MeshPhongMaterial({ 
        map: mainCylinderTexture,
        reflectivity: 0.5,
        specular: 0xffffff, 
        shininess: 100,
    });
    const mainCylinder = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, height), mainCylinderMaterial);
    mainCylinder.translateY(height/2 + 35);

    const discSideMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc9c9c9, 
        map: sideDiscTexture, 
        combine: THREE.MixOperation, 
        reflectivity: 0.5,
        specular: 0xc9c9c9, 
        shininess: 100,
    });
    const discSurfaceMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc9c9c9, 
        map: discTexture, 
        combine: THREE.MixOperation, 
        reflectivity: 0.5, 
        specular: 0xc9c9c9, 
        shininess: 100,
    });

    const discPart1 = new THREE.Mesh(
        new THREE.CylinderGeometry(50, 7, 15), 
        discSurfaceMaterial
    );
    discPart1.translateY(7.5);

    
    const discPart2 = new THREE.Mesh(
        new THREE.CylinderGeometry(50, 50, 7), 
        discSideMaterial
    );
    discPart2.translateY(15 + 3.5);

    const discPart3Geometry = new THREE.ConeGeometry(50, 4);
    
    /*
    const uvAttribute = discPart3Geometry.getAttribute('uv');
    // Iterate through each vertex and modify the UV coordinates
    for (let i = 0; i < uvAttribute.count / 2; i++) {
        // Get the original UV coordinates
        let originalU1 = uvAttribute.getX(i);
        let originalU2 = uvAttribute.getX(uvAttribute.count - i);

        // Modify the U coordinate based on the X position of the vertex (adjust scaling as needed)
        uvAttribute.setX(i, originalU1 * (1 - discPart3Geometry.attributes.position.getX(i) / 4));
        uvAttribute.setX(uvAttribute.count  - i, originalU2 * (1 + discPart3Geometry.attributes.position.getX(i) / 4));
    }
    */

    const discPart3 = new THREE.Mesh(
        discPart3Geometry,
        discSurfaceMaterial
    );
    discPart3.translateY(15 + 7 + 2);
    
    const disc = new THREE.Group();
    disc
        .add(discPart1)
        .add(discPart2)
        .add(discPart3);

    const auxCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(12, 8, 7), 
        new THREE.MeshPhysicalMaterial({ map: discTexture })
    );

    const bottomPartMaterial = new THREE.MeshPhongMaterial({
        color: 0x2b00ff
    });
    const bottomPart1Mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(12, 12, 20), 
        bottomPartMaterial
    );
    bottomPart1Mesh.translateY(10);
    
    const bottomPart2Mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(9, 12, 7), 
        bottomPartMaterial
    );
    bottomPart2Mesh.translateY(23.5);
    
    const bottomPart3Mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(9, 9, 5), 
        bottomPartMaterial
    );
    bottomPart3Mesh.translateY(29.5);
    
    const bottomPart4Mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(8, 9, 3), 
        bottomPartMaterial
    );
    bottomPart4Mesh.translateY(33.5);
    
    const step = (Math.PI * 2) / chairsAmount;
    let u = 0.0;
    let chair, cableMesh;
    cableChairs = [];
    for(let i=0; i<chairsAmount ;i++){
        let pointVec = new THREE.Vector3(Math.sin(u) * 40, 0, Math.cos(u) * 40);
        const chairMaterialProperties = {
            color: 0xdd33ff
        };
        chair = new Geometries.createPurpleChair();
        chair.translateY(-height - 20 - 3.5);
        cableMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, height + 20), 
            new THREE.MeshPhongMaterial({ color: 0x0 })
        );
        cableMesh.translateY(-(height + 20.0)/2);
        let cableAndChair = new THREE.Group();
        
        cableAndChair
            .add(chair)
            .add(cableMesh);
        cableAndChair.rotateY(u + Math.PI/2);
        cableAndChair.position.set(pointVec.x, 20, pointVec.z);
        cableChairs.push(cableAndChair);
        chairsGroup.add(cableAndChair);
        u += step;
    }

    chairsAndDiscGroup
        .add(disc)
        .add(auxCylinder)
        .add(chairsGroup);
    chairsAndDiscGroup.translateY(height + 35);

    mainRotatingGroup
        .add(chairsAndDiscGroup)
        .add(mainCylinder);

    flyingChairs
        .add(bottomPart1Mesh)
        .add(bottomPart2Mesh)
        .add(bottomPart3Mesh)
        .add(bottomPart4Mesh)
        .add(mainRotatingGroup);

    flyingChairs.position.set(-400, 0, -500);
}

function animate(){

    let randX = Math.random()/5000 * xSign;
    let randZ = Math.random()/5000 * zSign;
    x += randX;
    z += randZ;
    if(x > Math.PI/64 || x < -Math.PI/64){
        xSign *= -1;
    }
    if(z > Math.PI/64 || z < -Math.PI/64){
        zSign *= -1;
    }
    chairsAndDiscGroup.rotateX(randX);
    chairsAndDiscGroup.rotateZ(randZ);


    mainRotatingGroup.rotateY(Math.PI * t);
    cableChairs.forEach(cc => cc.rotateZ(centrifugalStep));
    t += step;

    if( t > 0.008 || t < step){
        step *= -1;
        centrifugalStep *= -1;
        t = t < 0 ? 0 : t;
    }
}

export { createFlyingChairs, flyingChairs, animate };
