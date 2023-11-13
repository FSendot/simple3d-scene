import * as THREE from 'three';
import * as Geometries from './basicGeometries.js';

let circlePoints = [];

function createFlyingChairs( chairsAmount = 10, height = 70.0 ){
    if(!Number.isInteger(chairsAmount) || chairsAmount < 1){
        chairsAmount = 5;
    }
    if(Number.isNaN(height) || height < 50.0){
        height = 70.0;
    }
    const mainCylinder = new THREE.CylinderGeometry(7, 7, height);
    const mainCylinderMesh = new THREE.Mesh(mainCylinder, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    mainCylinderMesh.translateY(height/2 + 35);

    const topPart1 = new THREE.CylinderGeometry(50, 7, 15);
    const topPart1Mesh = new THREE.Mesh(topPart1, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    topPart1Mesh.translateY(height + 7.5 + 35);
    const topPart2 = new THREE.CylinderGeometry(50, 50, 7);
    const topPart2Mesh = new THREE.Mesh(topPart2, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    topPart2Mesh.translateY(height + 15 + 3.5 + 35);
    
    const bottomPart1 = new THREE.CylinderGeometry(12, 12, 20);
    const bottomPart1Mesh = new THREE.Mesh(bottomPart1, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    bottomPart1Mesh.translateY(10);
    const bottomPart2 = new THREE.CylinderGeometry(9, 12, 7);
    const bottomPart2Mesh = new THREE.Mesh(bottomPart2, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    bottomPart2Mesh.translateY(23.5);
    const bottomPart3 = new THREE.CylinderGeometry(9, 9, 5);
    const bottomPart3Mesh = new THREE.Mesh(bottomPart3, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    bottomPart3Mesh.translateY(29.5);
    const bottomPart4 = new THREE.CylinderGeometry(8, 9, 3);
    const bottomPart4Mesh = new THREE.Mesh(bottomPart4, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    bottomPart4Mesh.translateY(33.5);
    
    circlePoints = [];
    const circle = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        40, 40,           // xRadius, yRadius
    );
    const step = 1.0/chairsAmount;
    const pointVec = new THREE.Vector3();
    let u = 0.0;
    let chair, cableGeometry, cableMesh;
    let cableChairs = [];
    for(let i=0; i<chairsAmount ;i++){
        circle.getPointAt(u, pointVec);
        pointVec.applyMatrix4(new THREE.Matrix4(
            1, 0, 0, 0,
            0, 0, -1, 0,
            0, 1, 0, 0,
            0, 0, 0, 1
        ));
        circlePoints.push(pointVec);
        chair = new Geometries.createChair();
        chair.translateY(35 - 3.5);
        chair.translateX(pointVec.x);
        chair.translateZ(pointVec.z);
        chair.rotateY(2*Math.PI*u);
        cableGeometry = new THREE.CylinderGeometry(0.5, 0.5, height + 20);
        cableMesh = new THREE.Mesh( cableGeometry, new THREE.MeshBasicMaterial({ color: 0xffff00 }))
        cableMesh.translateY((height + 20.0)/2 + 35);
        cableMesh.translateX(pointVec.x);
        cableMesh.translateZ(pointVec.z);
        cableChairs.push(new THREE.Group().add(chair).add(cableMesh))
        u += step;
    }
    

    // Group that will be added to the scene
    const group = new THREE.Group();
    cableChairs.forEach(cc => group.add(cc));
    group.add(mainCylinderMesh);
    group.add(topPart1Mesh);
    group.add(topPart2Mesh);
    group.add(bottomPart1Mesh);
    group.add(bottomPart2Mesh);
    group.add(bottomPart3Mesh);
    group.add(bottomPart4Mesh);
    return group;
}

export { createFlyingChairs };
