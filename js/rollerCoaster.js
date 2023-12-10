
import * as THREE from 'three';
import * as Geometries from './basicGeometries.js';

let trail = new THREE.Group();
let trailPath;
const passengerCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
passengerCamera.rotateY(Math.PI);

const carritoMesh = Geometries.createCarritoMesh();
carritoMesh.rotateX(Math.PI/2);
carritoMesh.rotateY(Math.PI/2);

const carrito = new THREE.Group().add(carritoMesh);
carrito.translateY(35);
passengerCamera.translateY(40);
let pt, t;

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3();

const loader = new THREE.TextureLoader();

function createTrail( whichTrail = true, columnsAmount = 5 ){
    if( !Number.isInteger(columnsAmount) || columnsAmount < 1 ){
        columnsAmount = 5;
    }
    const trailReflectionTexture = loader.load("./../maps/refmapGreyRoom3.jpg");

    trail.clear();
    
    const trailSteps = 100;
    const trailSegments = 12;

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
        ], true, 'chordal');
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

    const trailBuffGeometry = new THREE.BufferGeometry();
    const shapePoints = trailShape.extractPoints(trailSegments).shape.map( (point) => new THREE.Vector3(point.x - 5.5, point.y, 0));

    const vertices = [];
    const normals = [];

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    const quaternion = new THREE.Quaternion();
    const prevQuaternion = new THREE.Quaternion();
    prevQuaternion.setFromAxisAngle( up, Math.PI / 2 );

	const point = new THREE.Vector3();
	const prevPoint = new THREE.Vector3();
	prevPoint.copy( trailCurve.getPointAt( 0 ) );


    const vector1 = new THREE.Vector3();
    const vector2 = new THREE.Vector3();
    const vector3 = new THREE.Vector3();
    const vector4 = new THREE.Vector3();

    const normal1 = new THREE.Vector3();
    const normal2 = new THREE.Vector3();
    const normal3 = new THREE.Vector3();
    const normal4 = new THREE.Vector3();

    for ( let i = 1; i <= trailSteps; i ++ ) {

        point.copy( trailPath.getPointAt( i / trailSteps ) );

        up.set( 0, 1, 0 );

        forward.subVectors( point, prevPoint ).normalize();
        right.crossVectors( up, forward ).normalize();
        up.crossVectors( forward, right );

        var angle = Math.atan2( forward.x, forward.z );

        quaternion.setFromAxisAngle( up, angle );

        for ( let j = 0, jl = shapePoints.length; j < jl; j ++ ) {
            let point1 = shapePoints[ j ];
            let point2 = shapePoints[ ( j + 1 ) % jl ];

            vector1.copy( point1 );
            vector1.applyQuaternion( quaternion );
            vector1.add( point );

            vector2.copy( point2 );
            vector2.applyQuaternion( quaternion );
            vector2.add( point );

            vector3.copy( point2 );
            vector3.applyQuaternion( prevQuaternion );
            vector3.add( prevPoint );

            vector4.copy( point1 );
            vector4.applyQuaternion( prevQuaternion );
            vector4.add( prevPoint );

            vertices.push( vector1.x, vector1.y, vector1.z );
            vertices.push( vector2.x, vector2.y, vector2.z );
            vertices.push( vector4.x, vector4.y, vector4.z );

            vertices.push( vector2.x, vector2.y, vector2.z );
            vertices.push( vector3.x, vector3.y, vector3.z );
            vertices.push( vector4.x, vector4.y, vector4.z );

            normal1.copy( point1 );
            normal1.applyQuaternion( quaternion );
            normal1.normalize();

            normal2.copy( point2 );
            normal2.applyQuaternion( quaternion );
            normal2.normalize();

            normal3.copy( point2 );
            normal3.applyQuaternion( prevQuaternion );
            normal3.normalize();

            normal4.copy( point1 );
            normal4.applyQuaternion( prevQuaternion );
            normal4.normalize();

            normals.push( normal1.x, normal1.y, normal1.z );
            normals.push( normal2.x, normal2.y, normal2.z );
            normals.push( normal4.x, normal4.y, normal4.z );

            normals.push( normal2.x, normal2.y, normal2.z );
            normals.push( normal3.x, normal3.y, normal3.z );
            normals.push( normal4.x, normal4.y, normal4.z );
        }

        prevPoint.copy( point );
        prevQuaternion.copy( quaternion );

    }

    trailBuffGeometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
    trailBuffGeometry.setAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( normals ), 3 ) );
    trailBuffGeometry.translate(0, 35, 0);


    const steps = 1.0/columnsAmount;
    let path = 0.0;
    let column;
    const pathPoint = new THREE.Vector3();
    for(let i=0; i<columnsAmount ;i++){
        trailPath.getPoint(path, pathPoint);
        column = new THREE.Mesh(
            new THREE.CylinderGeometry(3, 3, pathPoint.y + 30),
            new THREE.MeshPhongMaterial({ 
                color: 0x26a269, 
                envMap: trailReflectionTexture,
                reflectivity: 0.9,
                specular: 0x444444, 
                shininess: 100,
            } )
        );
        column.translateX(pathPoint.x);
        column.translateY((pathPoint.y + 25)/2);
        column.translateZ(pathPoint.z);
        trail.add(column);
        path = path + steps;
    }

    const trailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xe47200,
        envMap: trailReflectionTexture,
        reflectivity: 0.8,
        specular: 0xbbbbbb, 
        shininess: 200,
    });

    trail.add( new THREE.Mesh(trailBuffGeometry, trailMaterial));
    
    return {trail: trail, trailPath: trailPath}
};

function animate(){
    // Animate the roller coaster and the specialized camera
    // set the marker position


    up.set( 0, 1 ,0 );
    const step = 0.0007;
    
    let previousPt = pt;
    pt = trailPath.getPoint( t );
    
    if(!pt){
        t = 0;
        pt = trailPath.getPoint( t );
    }


    // set the marker position
    carrito.position.set( pt.x, pt.y + 35, pt.z );
    passengerCamera.position.set( pt.x, pt.y + 50, pt.z );
    if(previousPt){
        forward.subVectors( pt, previousPt ).normalize();
        right.crossVectors( up, forward ).normalize();
        up.crossVectors( forward, right );
    }


    let angle = Math.atan2( forward.x, forward.z );

    // set the quaternion
    carrito.quaternion.setFromAxisAngle( up, angle );
    passengerCamera.quaternion.setFromAxisAngle( up, angle );
    passengerCamera.rotateY(Math.PI);

    t = (t - 1 > 0.001) ? 0 : t += step;

}

export { createTrail, animate, carrito, passengerCamera, trail } ;
