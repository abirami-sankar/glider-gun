import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'three/examples/jsm/libs/dat.gui.module'

// Set up the scene
const scene = new THREE.Scene();
console.log(scene);

// set up GUI
const gui = new dat.GUI()

// Add objects to scene

// 1. trying to draw coord axis
const line_material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

const pointsX = [];
pointsX.push( new THREE.Vector3( -100, 0, 0 ) );
pointsX.push( new THREE.Vector3( 0, 0, 0 ) );
pointsX.push( new THREE.Vector3( 100, 0, 0 ) );

const geometryX = new THREE.BufferGeometry().setFromPoints( pointsX );
const lineX = new THREE.Line( geometryX, line_material );
scene.add( lineX );

const pointsY = [];
pointsY.push( new THREE.Vector3( 0, -100, 0 ) );
pointsY.push( new THREE.Vector3( 0, 0, 0 ) );
pointsY.push( new THREE.Vector3( 0, 100, 0 ) );

const geometryY = new THREE.BufferGeometry().setFromPoints( pointsY );
const lineY = new THREE.Line( geometryY, line_material );
scene.add( lineY );

const pointsZ = [];
pointsY.push( new THREE.Vector3( 0, 0, -100 ) );
pointsY.push( new THREE.Vector3( 0, 0, 0 ) );
pointsY.push( new THREE.Vector3( 0, 0, 100 ) );

const geometryZ = new THREE.BufferGeometry().setFromPoints( pointsZ );
const lineZ = new THREE.Line( geometryZ, line_material );
scene.add( lineZ );

// 2. simple cubes
let cube_index = make3DArray();
console.log(cube_index)
initCubes(cube_index)

// Set up the Camera...
const camera = new THREE.PerspectiveCamera( 75, // FOV
                                            window.innerWidth / window.innerHeight, // Aspect ratio
                                            0.1, 1000 // near and far clipping point
                                        ); 

// ... and lights
const light1 = new THREE.PointLight( 0xffffff, 100);
light1.position.set( 3, 3, 1 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xff0000, 100);
light2.position.set( 3, 4, 5 );
scene.add( light2 );

// const pointLightHelper = new THREE.PointLightHelper( light, 1 );
// pointLightHelper.position.set(1,1,1);
// scene.add( pointLightHelper );

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// orbital control
const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.z = 15;
controls.update();

// dat.gui interface
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 20)
cameraFolder.open()

function animate() {
	requestAnimationFrame( animate );

    controls.update();

	renderer.render( scene, camera );
}
animate();

// Helper functions

// 1. generate initial 3d array
function make3DArray() {
    let arr = new Array();
    for (let i = 0; i < 5; i++) {
        arr.push([]);
        for(let j = 0; j < 5; j++){
            arr[i].push([]);
            for(let k = 0; k < 5; k++){
                arr[i][j].push(Math.floor(Math.random() * 4));
            }
            //console.log(arr[i][j])
        }
    }
    return arr;
}

// 3. initialise cubes based on array
function initCubes(cube_index){
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshStandardMaterial( { color: 0xfcfcfc } );
    material.roughness = 0;

    const n = 15;
    let cubes = 0;

    for(let i = 0; i < 5; i++){
        for(let j = 0; j < 5; j++){
            for(let k = 0; k < 5; k++){
                if (cube_index[i][j][k] == 1 && cubes < n) {
                    const cube = new THREE.Mesh( geometry, material );
                    cube.position.set(i,j,k);
                    scene.add( cube );
                    cubes++;
                }
            }
        }
    }
}

// 2. calculate neuman neighbor for each cell 
// using neuman here just to reduce the amount of calcualtions for each cell
// moore will have 26 neighbors while neuman will have just 6
function checkNeighbors(arr, x, y, z) {
    let sum = 0

    for (let i = -1; i < 2; i++){
        sum += arr[z + i][y][x]
    }
    for (let j = -1; j < 2; j++){
        sum += arr[z][y + j][x]
    }
    for (let k = -1; k < 2; k++){
        sum += arr[z][y][x + k]
    }

    return sum
}