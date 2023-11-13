import * as THREE from 'three';

function createChair(){
    const firstBox = new THREE.BoxGeometry(4, 1, 4);
    firstBox.translate(0,0,2);
    const secondBox = new THREE.BoxGeometry(4, 4, 1);
    secondBox.translate(0,2,0);

    const chairMaterial = new THREE.MeshBasicMaterial({ color: 0xe5de00 });
    const group = new THREE.Group();
    group.add(new THREE.Mesh(firstBox, chairMaterial));
    group.add(new THREE.Mesh(secondBox, chairMaterial));
    return group;
}


function createCarritoMesh(){
    const extrudeShape = new THREE.Shape();
    extrudeShape.moveTo(0, 0);
    extrudeShape.lineTo(2.5, 0);
    extrudeShape.arc(0, 2.5, 2.5, 1.5*Math.PI, 0);
    extrudeShape.moveTo(5, 2.5);
    extrudeShape.lineTo(5, 3.5);
    extrudeShape.arc(-2.5, 0, 2.5, 0, 0.5*Math.PI);
    extrudeShape.moveTo(2.5, 6);
    extrudeShape.lineTo(2.5, 4);
    extrudeShape.moveTo(2.5, 4);
    extrudeShape.lineTo(-2.5, 4);
    extrudeShape.moveTo(-2.5, 4);
    extrudeShape.lineTo(-2.5, 6);
    extrudeShape.arc(0, -2.5, 2.5, 0.5*Math.PI, Math.PI);
    extrudeShape.moveTo(-5, 3.5);
    extrudeShape.lineTo(-5, 2.5);
    extrudeShape.arc(2.5, 0, 2.5, Math.PI, 1.5*Math.PI);

    const extrudeSettings1 = { 
        depth: 12, 
        steps: 2, 
    };

    const extrudeGeometry = new THREE.ExtrudeGeometry(extrudeShape, extrudeSettings1);
    const extrudeMaterial = new THREE.MeshBasicMaterial( { color: 0xe47200 } );
    const carritoMesh = new THREE.Mesh( extrudeGeometry, extrudeMaterial );


    const b1 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, -2.5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 2.5)
    );

    const b2 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 2.5),
        new THREE.Vector3(0, 0, 5),
        new THREE.Vector3(0, 2.5, 5)
    );

    const b3 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 2.5, 5),
        new THREE.Vector3(0, 3, 5),
        new THREE.Vector3(0, 3.5, 5)
    );

    const b4 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 3.5, 5),
        new THREE.Vector3(0, 6, 5),
        new THREE.Vector3(0, 6, 2.5)
    );

    const b5 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 6, 2.5),
        new THREE.Vector3(0, 6, 0),
        new THREE.Vector3(0, 6, -2.5)
    );

    const b6 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 6, -2.5),
        new THREE.Vector3(0, 6, -5),
        new THREE.Vector3(0, 3.5, -5)
    );

    const b7 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 3.5, -5),
        new THREE.Vector3(0, 3, -5),
        new THREE.Vector3(0, 2.5, -5)
    );

    const b8 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 2.5, -5),
        new THREE.Vector3(0, 0, -5),
        new THREE.Vector3(0, 0, -2.5)
    );

    const surfacePath = new THREE.CurvePath();
    surfacePath.add(b1);
    surfacePath.add(b2);
    surfacePath.add(b3);
    surfacePath.add(b4);
    surfacePath.add(b5);
    surfacePath.add(b6);
    surfacePath.add(b7);
    surfacePath.add(b8);

    const extrudeSettings = {
        curveSegments: 40,
        steps: 20,
        bevelEnabled: false,
        extrudePath: surfacePath,
    };

    // Create sweeping surface
    const sweepSurfaceShape = new THREE.Shape();
    sweepSurfaceShape.moveTo(-2.5,0);

    sweepSurfaceShape.lineTo(0, 2);
    sweepSurfaceShape.lineTo(0, 3);
    sweepSurfaceShape.lineTo(-2.5, 3);
    sweepSurfaceShape.lineTo(-2.5, 0);

    const sweepGeometry = new THREE.ExtrudeGeometry(sweepSurfaceShape, extrudeSettings);
    const sweepGeometry2 = sweepGeometry.clone()

    const group = new THREE.Group()

    sweepGeometry2.rotateY(-Math.PI/2);
    sweepGeometry2.translate(0,0,-3);
    sweepGeometry.rotateY(Math.PI/2)
    sweepGeometry.translate(0,0,15);


    const sweepMesh2 = new THREE.Mesh(sweepGeometry2, extrudeMaterial);
    const sweepMesh = new THREE.Mesh(sweepGeometry, extrudeMaterial);
    group.add(sweepMesh);
    group.add(sweepMesh2);
    group.add(carritoMesh);

    const frontChair = createChair();
    frontChair.translateZ(7);
    frontChair.translateY(5);
    group.add(frontChair);
    const backChair = createChair();
    backChair.translateY(5)
    backChair.translateZ(1);
    group.add(backChair);

    return group;
}


export { createCarritoMesh, createChair };
