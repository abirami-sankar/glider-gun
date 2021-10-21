import React from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'three/examples/jsm/libs/dat.gui.module';

const size = 50;
const density = 1000;

class World extends React.Component {
    constructor(props) {
        super(props);

        // binding a bunch of methods to better access the three.js scene
        // including the standard animate function in three.js which is bound
        // to class since we cant access this.scene in outside function (private)
        this.start = this.start.bind(this);
        this.drawAxes = this.drawAxes.bind(this);
        this.generateCubes = this.generateCubes.bind(this);
        this.updateCubes = this.updateCubes.bind(this);
        this.nextGeneration = this.nextGeneration.bind(this);
        this.populateWorld = this.populateWorld.bind(this);
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
        //const line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });
       // this.drawAxes(line_material);

       // add empty cubes to the scene
        this.generateCubes();
        

        // camera
        const camera = new THREE.PerspectiveCamera( 75, 
            window.innerWidth / window.innerHeight, 
            0.1, 1000 
        ); 

        // need to add basic lighting
        const light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light1 );

        const light2 = new THREE.PointLight( 0xff0000, 1, 100 ); 
        light2.position.set(10,50,0);
        this.scene.add( light2 );

        const light3 = new THREE.PointLight( 0x0000ff, 1, 100 ); 
        light3.position.set(50,50,50);
        this.scene.add( light3 );

        // adding gui for light to set position
        const lightFolder = gui.addFolder('Red Light')
        lightFolder.add(light2.position, 'z', 0, 200)
        lightFolder.add(light2.position, 'y', 0, 200)
        lightFolder.add(light2.position, 'x', 0, 200)
        lightFolder.open()

        // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor('#303030');

        // setting up orbit controller
        // set camera position and then update orbit control 
        // control needs to be updated after each manual camera change
        const controls = new OrbitControls( camera, renderer.domElement );
        camera.position.set(100,50,75);
        controls.update();

        // adding gui for camera to set position
        const cameraFolder = gui.addFolder('Camera')
        cameraFolder.add(camera.position, 'z', 0, 200)
        cameraFolder.add(camera.position, 'y', 0, 200)
        cameraFolder.add(camera.position, 'x', 0, 200)
        cameraFolder.open()
        
        // adding everythin we have so far into the class
        this.camera = camera
        this.controls = controls
        this.renderer = renderer

        this.mount.appendChild( renderer.domElement );
    }
    
    start() {
        this.cubeIndex = make3DArray();
        this.updateCubes();

        // start the animation
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

    generateCubes(){
        const geometry = new THREE.BoxGeometry(1,1,1);
        
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                for(let k = 0; k < size; k++){
                    const material = new THREE.MeshStandardMaterial( { color: 0xff2399 } );
                    material.transparent = true;
                    material.opacity = 0;
                    material.roughness = 0;
                    const cube = new THREE.Mesh( geometry, material );
                    cube.position.set(i,j,k);
                    cube.is_ob = true;
                    this.scene.add( cube );
                }
            }
        }
    }

    updateCubes(){   
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                for(let k = 0; k < size; k++){
                    if (this.cubeIndex[i][j][k].state === 1) {
                        const cube = this.scene.getObjectById(this.cubeIndex[i][j][k].id)
                        console.log(cube);
                        cube.material.opacity = 0.5;
                    }
                }
            }
        }
    }

    nextGeneration() {
        let newGen = this.cubeIndex;
        //console.log(newGen)

        for(let i = 1; i < size-1; i++){
            for(let j = 1; j < size-1; j++){
                for(let k = 1; k < size-1; k++){
                    const cell = this.cubeIndex[i][j][k]
                    const neighbors = checkNeighborsM(this.cubeIndex, k, j, i)
                    //console.log("neighbors: ", neighbors)

                    if (cell.state === 0) {
                        if (neighbors === 3) {
                            newGen[i][j][k] = 1
                        }
                    } else {
                        if (neighbors === 3 || neighbors === 2) {
                            newGen[i][j][k] = 1
                        } else if(neighbors >= 4 || neighbors <= 1) {
                            newGen[i][j][k] = 0 
                        }
                    }
                }
            }
        }

        //console.log(newGen);

        this.cubeIndex = newGen;
        this.updateCubes();
    }

    populateWorld() {
        this.updateCubes();
    }

    resetWorld() {
        this.cubeIndex = make3DArray();
    
        this.updateCubes();
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
        this.renderer.render(this.scene, this.camera)
        this.nextGeneration();
        this.frameId = window.requestAnimationFrame(() => setInterval(this.animate, 500))
    }
    
    render() {
        return (
            // the button has to be specifically styled to make it render 
            // over the three.js scene
            <div>
                <div>
                    <select id="rulesets" name="rulesets" defaultValue = "select">
                        <option value="select" disabled>Select Ruleset</option>
                        <option value="Moore">GOL- Moore neighborhood</option>
                        <option value="Neumann">GOL- Neumann neighborhood</option>
                    </select>

                    <input id = "density" type="text" placeholder="Set Density" />
                    <button id = "start" onClick={this.start}>Start</button>
                </div>
                <button id = "reset" onClick={this.resetWorld}>Reset World</button>
                <div ref={ref => (this.mount = ref)} />
            </div>
        );
    }
}

//helper

// 1. generate initial 3d array
function make3DArray() {
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
                // console.log(arr[i][j][k])
            }
        }
    }

    for (let i = Math.floor(size/4); i < Math.floor(3*size/4); i++) {
        for (let j = Math.floor(size/4); j < Math.floor(3*size/4); j++) {
            for (let k = Math.floor(size/4); k < Math.floor(3*size/4); k++) {
                arr[i][j][k].state = Math.floor(Math.random() * 2) == 1 ? 1: 0;
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