import * as THREE from 'three';
import * as Geometries from './basicGeometries.js';

let cableChairs = [];
let chairsAndDiscGroup, chairsGroup, flyingChairs;

let discHeight;

let x = 0.0;
let xSign = 1;

let z = 0.0;
let zSign = 1;

let t = 0;
let step = 0.000001;
let centrifugalStep = Math.PI/6 * (step / 0.008) * -1;

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
    cableChairs = [];
    t = 0;
    z = 0;
    x = 0;
    const mainCylinder = new THREE.CylinderGeometry(7, 7, height);
    const mainCylinderMesh = new THREE.Mesh(mainCylinder, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    mainCylinderMesh.translateY(height/2 + 35);

    const discPart1 = new THREE.Mesh(new THREE.CylinderGeometry(50, 7, 15), new THREE.MeshPhysicalMaterial({ 
            color: 0x049ef4,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));

    discPart1.translateY(7.5);
    const discPart2 = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 7), new THREE.MeshPhysicalMaterial({ 
            color: 0x049ef4,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));

    discPart2.translateY(15 + 3.5);
    
    const disc = new THREE.Group();
    disc
        .add(discPart1)
        .add(discPart2);

    const auxCylinder = new THREE.Mesh(new THREE.CylinderGeometry(12, 8, 7), new THREE.MeshPhysicalMaterial({ 
            color: 0x049ef4,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));

    auxCylinder.translateY(height + 35);
    
    const bottomPart1 = new THREE.CylinderGeometry(12, 12, 20);
    const bottomPart1Mesh = new THREE.Mesh(bottomPart1, new THREE.MeshPhysicalMaterial({ 
            color: 0x049ef4,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));
    bottomPart1Mesh.translateY(10);
    const bottomPart2 = new THREE.CylinderGeometry(9, 12, 7);
    const bottomPart2Mesh = new THREE.Mesh(bottomPart2, new THREE.MeshPhysicalMaterial({ 
            color: 0x049ef4,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));
    bottomPart2Mesh.translateY(23.5);
    const bottomPart3 = new THREE.CylinderGeometry(9, 9, 5);
    const bottomPart3Mesh = new THREE.Mesh(bottomPart3, new THREE.MeshPhysicalMaterial({ 
            color: 0x049ef4,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));
    bottomPart3Mesh.translateY(29.5);
    const bottomPart4 = new THREE.CylinderGeometry(8, 9, 3);
    const bottomPart4Mesh = new THREE.Mesh(bottomPart4, new THREE.MeshPhysicalMaterial({ 
            color: 0x049ef4,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));
    bottomPart4Mesh.translateY(33.5);
    
    const step = (Math.PI * 2) / chairsAmount;
    let u = 0.0;
    let chair, cableGeometry, cableMesh;
    cableChairs = [];
    for(let i=0; i<chairsAmount ;i++){
        let pointVec = new THREE.Vector3(Math.sin(u) * 40, 0, Math.cos(u) * 40);
        chair = new Geometries.createChair();
        chair.translateY(-height - 20 - 3.5);
        cableGeometry = new THREE.CylinderGeometry(0.5, 0.5, height + 20);
        cableMesh = new THREE.Mesh( cableGeometry, new THREE.MeshPhysicalMaterial({ 
            color: 0x0,
            ior: 1.5,
            reflectivity: 0.5,
            iridescenceIOR: 1.3,
            specularIntensity: 1
        }));
        cableMesh.translateY(-(height + 20.0)/2);
        let cableAndChair = new THREE.Group();
        cableAndChair
            .add(chair)
            .add(cableMesh);
        cableAndChair.rotateY(u + Math.PI/2);
        cableAndChair.position.set(pointVec.x, 20, pointVec.z);
        cableChairs.push({
            cableAndChair: cableAndChair,
            location: pointVec
        });
        u += step;
    }
    
    cableChairs.forEach(cc => {
        chairsGroup.add(cc.cableAndChair);
    });

    chairsAndDiscGroup
        .add(disc)
        .add(chairsGroup);
    chairsAndDiscGroup.translateY(height + 35);

    flyingChairs
        .add(mainCylinderMesh)
        .add(bottomPart1Mesh)
        .add(bottomPart2Mesh)
        .add(bottomPart3Mesh)
        .add(bottomPart4Mesh)
        .add(auxCylinder)
        .add(chairsAndDiscGroup);

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


    chairsGroup.rotateY(Math.PI * t);
    cableChairs.forEach(cc => cc.cableAndChair.rotateZ(centrifugalStep));
    t += step;

    if( t > 0.008 || t < step){
        step *= -1;
        centrifugalStep *= -1;
        t = t < 0 ? 0 : t;
    }
}

export { createFlyingChairs, flyingChairs, animate };
