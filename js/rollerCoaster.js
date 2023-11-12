
import * as THREE from 'three';

let trail, trailPath;

function createTrail( whichTrail = true ){

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

    if(whichTrail){
        trail = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 8, 170, 25 ),
            new THREE.Vector3( 55, 225, 75 ),
            new THREE.Vector3( 55, 150, 180 ),
            new THREE.Vector3( 55, 140, 180 ),
            new THREE.Vector3( 60, 55, 140 ),
            new THREE.Vector3( 60, 55, 50 ),
            new THREE.Vector3( 60, 0, 0 ),
            new THREE.Vector3( 50, -55, -50 ),
            new THREE.Vector3( 50, -55, -140 ),
            new THREE.Vector3( 40, -140, -180 ),
            new THREE.Vector3( 30, -150, -180 ),
            new THREE.Vector3( 20, -270, -75 ),
            new THREE.Vector3( 20, -225, -50 ),
            new THREE.Vector3( 2, -170, -25 ),
        ], true, 'chordal')
    } else {
        trail =  new THREE.CatmullRomCurve3( [
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 0, 60, 0 ),
            new THREE.Vector3( 0, 120, 0 ),
            new THREE.Vector3( 55, 210, 0 ),
            new THREE.Vector3( 60, 240, 190 ),
            new THREE.Vector3( 60, 225, 158 ),
            new THREE.Vector3( 40, 155, 190 ),
            new THREE.Vector3( 40, -100, 170 ),
            new THREE.Vector3( 20, -50, 120 ),
            new THREE.Vector3( 20, -30, 60 ),
            new THREE.Vector3( 0, 0, 30 ),
        ], true, 'chordal')
    }
    trailPath = new THREE.CurvePath();
    trailPath.add(trail);

    const trailExtrudeSettings = {
        curveSegments: 50,
        steps: 100,
        bevelEnabled: false,
        extrudePath: trailPath,
    };
    const trailGeometry = new THREE.ExtrudeGeometry(trailShape, trailExtrudeSettings);

    trailGeometry.rotateZ(Math.PI/2);
    trail = new THREE.Mesh(trailGeometry, new THREE.MeshBasicMaterial( { color: 0xe47200 } ));
    return {trail: trail, trailPath: trailPath}
}

export default createTrail;
