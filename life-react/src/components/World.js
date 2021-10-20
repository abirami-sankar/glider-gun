import React from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'three/examples/jsm/libs/dat.gui.module';

class World extends React.Component {
    constructor(props) {
        super(props);

        // binding a bunch of methods to better access the three.js scene
        // including the standard animate function in three.js which is bound
        // to class since we cant access this.scene in outside function (private)
        this.start = this.start.bind(this);
        this.drawAxes = this.drawAxes.bind(this);
        this.drawCubes = this.drawCubes.bind(this);
        this.nextGeneration = this.nextGeneration.bind(this);
        this.populateWorld = this.nextGeneration.bind(this);
        this.resetWorld = this.resetWorld.bind(this);
        this.clearScene = this.clearScene.bind(this);
        this.animate = this.animate.bind(this);

        this.scene = new THREE.Scene();
        this.cubeIndex = [];
    }

    componentDidMount() {
        // setting up the three.js script portion


        // adding GUI incase we need to debug something later
        const gui = new dat.GUI();

        // co-ordinate axis just to provide some reference
        const line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        this.drawAxes(line_material);

        // initialising the boolean 3d array and adding cubes to scene based on it
        // draw is probably not the best name here
        this.cubeIndex = make3DArray();
        
        this.drawCubes();

        // camera
        const camera = new THREE.PerspectiveCamera( 75, 
            window.innerWidth / window.innerHeight, 
            0.1, 1000 
        ); 

        // need to add basic lighting

        // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor('#303030');

        // setting up orbit controller
        // set camera position and then update orbit control 
        // control needs to be updated after each manual camera change
        const controls = new OrbitControls( camera, renderer.domElement );
        camera.position.z = 25;
        controls.update();
        
        // adding everythin we have so far into the class
        this.camera = camera
        this.controls = controls
        this.renderer = renderer

        this.mount.appendChild( renderer.domElement );
    }
    
    start() {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate)
        }
        //this.nextGeneration();
    }

    drawAxes(material) {
        const pointsX = [];
        pointsX.push(new THREE.Vector3(-100, 0, 0));
        pointsX.push(new THREE.Vector3(0, 0, 0));
        pointsX.push(new THREE.Vector3(100, 0, 0));

        const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
        const lineX = new THREE.Line(geometryX, material);
        this.scene.add(lineX);

        const pointsY = [];
        pointsY.push(new THREE.Vector3(0, -100, 0));
        pointsY.push(new THREE.Vector3(0, 0, 0));
        pointsY.push(new THREE.Vector3(0, 100, 0));

        const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
        const lineY = new THREE.Line(geometryY, material);
        this.scene.add(lineY);
    }

    drawCubes(){
        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshStandardMaterial( { color: 0xfcfcfc } );
        material.roughness = 0;
    
        const n = 15;
        let cubes = 0;
    
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                for(let k = 0; k < 5; k++){
                    if (this.cubeIndex[i][j][k] === 1 && cubes < n) {
                        const cube = new THREE.Mesh( geometry, material );
                        cube.position.set(i,j,k);
                        cube.is_ob = true;
                        this.scene.add( cube );
                        cubes++;
                    }
                }
            }
        }
    }

    nextGeneration() {
        let newGen = this.cubeIndex;
        //console.log(newGen)

        for(let i = 1; i < 4; i++){
            for(let j = 1; j < 4; j++){
                for(let k = 1; k < 4; k++){
                    const cell = this.cubeIndex[i][j][k]
                    const neighbors = checkNeighbors(this.cubeIndex, k, j, i)

                    if (cell === 0) {
                        if (neighbors === 3) {
                            newGen[i][j][k] = 1
                        }
                    } else {
                        if (neighbors === 3 || neighbors === 2) {
                            newGen[i][j][k] = 1
                        } else if(neighbors > 3 || neighbors < 2) {
                            newGen[i][j][k] = 0 
                        }
                    }
                }
            }
        }

        console.log(newGen)

        this.cubeIndex = newGen;
        this.populateWorld();
    }

    populateWorld() {
        this.clearScene();
        this.drawCubes();
    }

    resetWorld() {
        this.clearScene();

        const newWorld = make3DArray();
        this.setState({cubeIndex: newWorld});

        this.drawCubes(this.scene, this.state.cubeIndex);
    }

    clearScene() {
        // iterates over each objet every frame and clears them
        // not the most efficient methif right?
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
        this.nextGeneration();
        this.renderer.render(this.scene, this.camera)
        //this.frameId = window.requestAnimationFrame(this.animate)
    }
    
    render() {
        return (
            // the button has to be specifically styled to make it render 
            // over the three.js scene
            <div>
                <div ref={ref => (this.mount = ref)} />
                <button id = "reset" onClick={this.resetWorld}>Reset World</button>
                <button id = "start" onClick={this.start}>Start</button>
            </div>
        );
    }
}

//helper

// 1. generate initial 3d array
function make3DArray() {
    let arr = [];
    for (let i = 0; i < 5; i++) {
        arr.push([]);
        for(let j = 0; j < 5; j++){
            arr[i].push([]);
            for(let k = 0; k < 5; k++){
                arr[i][j].push(Math.floor(Math.random() + 0.5));
            }
        }
    }
    return arr;
}

// 2. calculate neuman neighbor for each cell 
// using neuman here just to reduce the amount of calcualtions for each cell
// moore will have 26 neighbors while neuman will have just 6
function checkNeighbors(arr, x, y, z) {
    let sum = 0

    for (let i = -1; i < 2; i++){
        //console.log("for 1: x=", z+i, ", y=", y, ", z=", x)
        sum += arr[z + i][y][x]
    }
    for (let j = -1; j < 2; j++){
       // console.log("for 1: x=", z, ", y=", y+j, ", z=", x)
        sum += arr[z][y + j][x]
    }
    for (let k = -1; k < 2; k++){
        //console.log("for 1: x=", z, ", y=", y, ", z=", x+k)
        sum += arr[z][y][x + k]
    }

    sum = sum - (3*arr[z][y][x])

    return sum
}


export default World;