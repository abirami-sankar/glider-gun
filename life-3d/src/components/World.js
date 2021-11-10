import React from "react";
import { Link } from 'react-router-dom';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const size = 45;

class World extends React.Component {
    constructor(props) {
        super(props);

        // binding a bunch of methods to better access the three.js scene
        // including the standard animate function in three.js which is bound
        // to class since we cant access this.scene in outside function (private)
        this.start = this.start.bind(this);
        this.drawCubes = this.drawCubes.bind(this);
        this.nextGeneration = this.nextGeneration.bind(this);
        this.populateWorld = this.populateWorld.bind(this);
        this.resetWorld = this.resetWorld.bind(this);
        this.clearScene = this.clearScene.bind(this);
        this.animate = this.animate.bind(this);

        this.scene = new THREE.Scene();

        // 3d array that keeps track of whether a cube is drawn at a particular index or not
        this.cubeIndex = [];
    }

    componentDidMount() {
        // setting up the three.js script portion

        // camera
        const camera = new THREE.PerspectiveCamera( 75, 
            window.innerWidth / window.innerHeight, 
            0.1, 1000 
        ); 

        // adding basic lighting
        const light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light1 );

        const light2 = new THREE.PointLight( 0xff0000, 1, 100 ); 
        light2.position.set(10,50,0);
        this.scene.add( light2 );

        const light3 = new THREE.PointLight( 0x0000ff, 1, 100 ); 
        light3.position.set(50,50,50);
        this.scene.add( light3 );

        
        // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor('#202124');

        // setting up orbit controller
        // set camera position and then update orbit control 
        // control needs to be updated after each manual camera change
        const controls = new OrbitControls( camera, renderer.domElement );
        camera.position.set(100,50,75);
        controls.update();

        
        // adding everythin we have so far into the class
        this.camera = camera
        this.controls = controls
        this.renderer = renderer

        this.mount.appendChild( renderer.domElement );
    }
    
    start() {
        // executed when start-btn pressed

        // initialises cube config to scene
        this.cubeIndex = make3DArray(this.densityRef.value);
        
        this.drawCubes();

        // start the animation
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate)
        }
    }

    drawCubes(){
        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshStandardMaterial( { color: 0xff2399 } );
        material.transparent = true;
        material.opacity = 0.5;
        material.roughness = 0;

        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                for(let k = 0; k < size; k++){
                    if (this.cubeIndex[i][j][k].state === 1) {
                        const cube = new THREE.Mesh( geometry, material );
                        cube.position.set(i,j,k);
                        cube.is_ob = true;
                        this.scene.add( cube );
                    }
                }
            }
        }
    }

    nextGeneration() {
        let newGen = this.cubeIndex;
        
        for(let i = 1; i < size-1; i++){
            for(let j = 1; j < size-1; j++){
                for(let k = 1; k < size-1; k++){
                    const cell = this.cubeIndex[i][j][k];

                    // load in ruleset based on dropdown
                    let neighbors
                    if (this.ruleRef != null) {
                        switch(this.ruleRef.value){
                            case "Moore":
                                neighbors = checkNeighborsM(this.cubeIndex, k, j, i);

                                // GOL rules (slightly tweaked to fit in 3d)
                                if (cell.state === 0) {
                                    if (neighbors === 5) {
                                        newGen[i][j][k].state = 1
                                    } else {
                                        newGen[i][j][k].state = 0
                                    }
                                }
                                else {
                                    if (neighbors === 5 || neighbors === 6) {
                                        newGen[i][j][k].state = 1
                                    } else if(neighbors >= 7 || neighbors <= 4) {
                                        newGen[i][j][k].state = 0 
                                    }
                                }
                                break;
                            case "Neumann":
                                neighbors = checkNeighborsN(this.cubeIndex, k, j, i)

                                // GOL rules
                                if (cell.state === 0) {
                                    if (neighbors === 3) {
                                        newGen[i][j][k].state = 1
                                    } else {
                                        newGen[i][j][k].state = 0
                                    }
                                }
                                else {
                                    if (neighbors === 2 || neighbors === 3) {
                                        newGen[i][j][k].state = 1
                                    } else if(neighbors >= 4 || neighbors <= 1) {
                                        newGen[i][j][k].state = 0 
                                    }
                                }
                                break;
                            default:
                                neighbors = checkNeighborsM(this.cubeIndex, k, j, i)
                                
                        }

                    }
                }
            }
        }

        this.cubeIndex = newGen;
        this.populateWorld();
    }

    populateWorld() {
        this.clearScene();
        this.drawCubes();
    }

    resetWorld() {
        this.clearScene();

        this.cubeIndex = make3DArray(this.densityRef.value);
        this.drawCubes();
    }

    clearScene() {
        // iterates over each object every frame and clears them
        let obj, i;
        for (i = this.scene.children.length - 1; i >= 0 ; i --) {
            obj = this.scene.children[ i ];
            if (obj.is_ob) {
                this.scene.remove(obj); 
            }
        }
    }
    
    animate() {   
        this.controls.update(); 
        this.renderer.render(this.scene, this.camera)
        this.nextGeneration();
        this.frameId = window.requestAnimationFrame(() => setInterval(this.animate, 1000))
    }
    
    render() {
        return (
            <div>
                <Link to="/" id="back-btn">Back</Link>

                <div id = "input">
                    <div className = "rule-select">
                        <select ref = {ref => (this.ruleRef = ref)} id="rulesets" name="rulesets" defaultValue = "select" required>
                            <option value="select" disabled>Select Ruleset</option>
                            <option value="Moore">GOL- Moore neighborhood</option>
                            <option value="Neumann">GOL- Neumann neighborhood</option>
                        </select>
                    </div>
                
                    <input ref = {ref => (this.densityRef = ref)} id = "density" type="number" placeholder="Set Density" required />
                    <button id = "start" onClick={this.start}>Start</button>
                </div>
                
                <div ref={ref => (this.mount = ref)} />
            </div>
        );
    }
}

// helpers

// 1. generate initial 3d array
function make3DArray(density) {
    let arr = [];

    let cubes = 0;
    let id = 1;

    for (let i = 0; i < size; i++) {
        arr.push([]);
        for(let j = 0; j < size; j++){
            arr[i].push([]);
            for(let k = 0; k < size; k++){
                arr[i][j].push({state: 0, id: id});
                id++;
                //console.log(arr[i][j][k])
            }
        }
    }

    for (let i = Math.floor(size/4); i < Math.floor(3*size/4); i++) {
        for (let j = Math.floor(size/4); j < Math.floor(3*size/4); j++) {
            for (let k = Math.floor(size/4); k < Math.floor(3*size/4); k++) {
                arr[i][j][k].state = Math.floor(Math.random() * 3) === 1 ? 1: 0;
                if (arr[i][j][k].state === 1) {
                    cubes++;
                    if (cubes > density) {
                        arr[i][j][k].state = 0;
                    }
                }
            }
        }
    }
    return arr;
}

// 2. calculate neuman neighbor for each cell 
// using neuman here just to reduce the amount of calcualtions for each cell
// moore will have 26 neighbors while neuman will have just 6
function checkNeighborsN(arr, x, y, z) {
    let sum = 0

    for (let i = -1; i < 2; i++){
        //console.log("for 1: x=", z+i, ", y=", y, ", z=", x)
        sum += arr[z + i][y][x].state
    }
    for (let j = -1; j < 2; j++){
       // console.log("for 1: x=", z, ", y=", y+j, ", z=", x)
        sum += arr[z][y + j][x].state
    }
    for (let k = -1; k < 2; k++){
        //console.log("for 1: x=", z, ", y=", y, ", z=", x+k)
        sum += arr[z][y][x + k].state
    }

    sum = sum - (3*arr[z][y][x].state)

    return sum
}

// 3. Calculate moore neighbours 
function checkNeighborsM (arr, x,y,z) {
    let sum = 0;

    for (let i = -1; i<2; i++) {
        for (let j = -1; j<2; j++) {
            for (let k = -1; k<2; k++) {
                sum += arr[z+i][y+j][x+k].state;
            }
        }
    }

    sum -= arr[z][y][x].state;

    return sum
}

export default World;