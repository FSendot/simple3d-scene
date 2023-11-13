
import * as THREE from 'three';
import * as Geometries from './basicGeometries.js';

let trail, trailPath;
const passengerCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const carrito = Geometries.createCarritoMesh();

let up = new THREE.Vector3( 0, 1, 0 );
let axis = new THREE.Vector3( );
let pt, radians, tangent, t;


function createTrail( whichTrail = true, columnsAmount = 5 ){
    if( !Number.isInteger(columnsAmount) || columnsAmount < 1 ){
        columnsAmount = 5;
    }

    trail = new THREE.Group();
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
    let trailCurve;

    if(whichTrail){
        trailCurve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 170, 8, 25 ),
            new THREE.Vector3( 225, 55, 75 ),
            new THREE.Vector3( 150, 55, 180 ),
            new THREE.Vector3( 140, 55, 180 ),
            new THREE.Vector3( 55, 60, 140 ),
            new THREE.Vector3( 55, 60, 50 ),
            new THREE.Vector3( 0, 60, 0 ),
            new THREE.Vector3( -55, 50, -50 ),
            new THREE.Vector3( -55, 50, -140 ),
            new THREE.Vector3( -140, 40, -180 ),
            new THREE.Vector3( -150, 30, -180 ),
            new THREE.Vector3( -270, 20, -75 ),
            new THREE.Vector3( -225, 20, -50 ),
            new THREE.Vector3( -170, 2, -25 ),
        ], true, 'chordal')
    } else {
        trailCurve =  new THREE.CatmullRomCurve3( [
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 60, 0, 0 ),
            new THREE.Vector3( 120, 0, 0 ),
            new THREE.Vector3( 210, 55, 0 ),
            new THREE.Vector3( 240, 60, 190 ),
            new THREE.Vector3( 225, 60, 158 ),
            new THREE.Vector3( 155, 40, 190 ),
            new THREE.Vector3( -100, 40, 170 ),
            new THREE.Vector3( -50, 20, 120 ),
            new THREE.Vector3( -30, 20, 60 ),
            new THREE.Vector3( 0, 0, 30 ),
        ], true, 'chordal')
    }
    trailPath = new THREE.CurvePath();
    trailPath.add(trailCurve);

    const steps = 1.0/columnsAmount;
    let path = 0.0;
    let column;
    const pathPoint = new THREE.Vector3();
    for(let i=0; i<columnsAmount ;i++){
        trailPath.getPoint(path, pathPoint);
        column = new THREE.Mesh(
            new THREE.CylinderGeometry(3, 3, pathPoint.y + 30),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 } )
        );
        column.translateX(pathPoint.x);
        column.translateY((pathPoint.y + 25)/2);
        column.translateZ(pathPoint.z);
        trail.add(column);
        path = path + steps;
    }
    const trailExtrudeSettings = {
        curveSegments: 50,
        steps: 100,
        bevelEnabled: false,
        extrudePath: trailPath,
    };
    const trailGeometry = new THREE.ExtrudeGeometry(trailShape, trailExtrudeSettings);

    // trailGeometry.rotateZ(Math.PI/2);
    trailGeometry.translate(0,30,0);

    trail.add( new THREE.Mesh(trailGeometry, new THREE.MeshBasicMaterial( { color: 0xe47200 } )));
    
    return {trail: trail, trailPath: trailPath}
};

function animate(){
    // Animate the roller coaster and the specialized camera
    // set the marker position
    pt = trailPath.getPoint( t );
    if(!pt){
        t = 0;
        pt = trailPath.getPoint( t );
    }

    // set the marker position
    carrito.position.set( pt.x, pt.y + 35, pt.z );
    passengerCamera.position.set( pt.x, pt.y + 40, pt.z );

    // get the tangent to the curve
    tangent = trailPath.getTangent( t ).normalize();

    // calculate the axis to rotate around
    axis.crossVectors( up, tangent ).normalize();

    // calcluate the angle between the up vector and the tangent
    radians = Math.acos( up.dot( tangent ) ) + 1.5 * Math.PI;

    // set the quaternion
    carrito.quaternion.setFromAxisAngle( axis, radians );
    passengerCamera.quaternion.setFromAxisAngle( axis, radians );

    t = (t - 1 > 0.001) ? 0 : t += 0.0007;

}

export { createTrail, animate, carrito, passengerCamera, trail } ;
