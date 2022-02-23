*Abirami Sankar*
*Country: India*
*Year: 2021*

## Implementing Game of Life in 3d

#### Background
Cellular automaton (CA) is a discrete computational model. It is a collection of “coloured” cells on a grid of specified shape and dimension that evolves over discrete time steps. The evolution is controlled by a finite set of rules based on the states of the neighbouring cells. The concept was originally discovered in the 40s by Neumann and Ulam. 

In the 70s, mathematician Conway defined a specific type of CA which he called ‘Game of Life (GOL)’ which expanded the interest in CA far beyond academics. GOL is a 2-dimensional CA. It is a zero-player game (only the initial state needs to be defined, no other input required) and is a Turing Complete model.
The world of GOL is an infinite orthogonal 2d grid of square cells each of which has 2 possible states- alive or dead. Each cell interacts with its nearest neighbours (when considering neighbours, two variations are possible- Neumann neighbourhood where only horizontal and vertically adjacent neighbours are considered and Moore neighbourhood where diagonal neighbours are included as well). In each step the following transitions occurs:
- Any live cell with fewer than 2 live neighbour dies
- Any live cell with more than 3 live neighbour dies
- Any live cell with 2 or 3 live neighbour remains alive
- Any dead cell with exactly 3 live neighbour becomes alive

In this project, I wanted to work writing code for 3d scenes. Extrapolating GOL from 2d to a 3d space felt quite interesting and so I worked on an interactive 3d simulation of GOL. I made a web-based application using React and ThreeJS. I chose to work with React and ThreeJS because it seemed to be the most popular way to have 3d graphics running on a browser. All the code files are contained within the folder Life-3d.

#### How to run
To run this project, [node](https://nodejs.org/en/download/) must be installed.
Clone the repo from github.
Set life-3d as the working directory.
Once inside life-3d, load all the necessary packages using `npm install`
Once that’s done, start the local server using `npm start`

#### Life-3d
##### Code Files
- index.js
- index.html
- index.css
- React Components
    * App.js
    * Home.js
    * World.js

index.js simply renders the App component to index.html. App.js sets up a react router, and routes between the home screen (Home.js) and the GOL simulation screen (World.js). index.css contains all the custom styles that I wrote.

##### Home Screen (Home.js)
The home screen contains a brief description of the project and a little bit of background on CA and GOL. It has a view project button which takes us to the simulation. The content is displayed using flexbox to make it easier to organise and style the content. The style def for the flexbox is in index.css

##### Simulation (World.js)
The constructor sets up the two main variables- the threeJs scene and the 3d array that maintains the state of the world. The universe is a 3d space and each cell is a unit cube. Since an infinite world would be too costly to attempt, the universe is bound to a 45x45x45 space. The state of all the cells in the universe is maintained in a 3d Boolean array. The array determines whether a cell should be rendered at a given coordinate.

When the World component is being created for the first time, the componentDidMount() function is executed. This function sets up the foundation for the threeJs scene. It sets up the camera and renderer and adds some basic lights to the scene. 

On the top of the screen, there are input fields prompting the user to select a ruleset for the simulation and to enter the number of cubes to start with. There is a start button which calls the start() method. The start() method initialises the 3d array, and adds cubes to the scene based on the array values. It also begins the animation which updates every 1 second.

Each frame, we iterate over the 3d array and add cubes to the scene which is then rendered. After every update, all the cubes are deleted from the scene so that fresh ones can be added again. While this method worked, it felt like a waste of energy to delete the cubes after every update call. I tried having the entire 45x45x45 occupied fully by unit cubes. Each unit cube would get a different material, and we could simply change the properties of the material instead of creating fresh objects and materials each time. This technique, however, didn’t seem to work since it only made the browser extra slow.

The input fields on the top allow the user to control the density of cubes at the beginning, and the ruleset that governs the simulation. Two rulesets can be chosen from- Neumann and Moore. In Moore ruleset, a cell is affected by horizontal, vertical and diagonal neighbours while in Neumann ruleset a cell is affected only by horizontal and vertical neighbours. Going by the Moore ruleset, a cell would have 8 neighbours in a 2d space and 26 in 3d and Nuemann would give the cells 4 neighbours in 2d and 6 in 3d. Owing to the huge difference between 8 and 26, I had to tweak the ruleset a little so that the simulation looks interesting. Thus, when Moore ruleset is selected, the World would update itself based on these rules:
- Any live cell with fewer than 5 live neighbour dies
- Any live cell with more than 6 live neighbour dies
- Any live cell with 5 or 6 live neighbour remains alive
- Any dead cell with exactly 5 live neighbour becomes alive
In case of Neumann, the ruleset previously described in the background section is retained.

#### Process
Before jumping straight into GOL simulation, I had to first familiarise myself with React, 3js and GOL itself. I spent about 4 days on this. I did this by putting together a little game where users can draw a starting configuration and see a GOL simulation playout on a finite 2d grid. The code for this is written in Lua and is executed with the help of the game engine Love2D (I’m doing CS50 and GD50 together, so working with Lua and Love2D was the most efficient choice. The source code for the same can be found [here](https://github.com/abirami-sankar/glider-gun/tree/main/life-2d)).   
Coming to React, I started with a simple Hello world program. Then I had a simple clock running that updated every second. Finally, I made a simple tic-tac-toe game using the React documentation to guide me. For 3js, I spent time setting up basic shapes, camera and lighting settings etc. Once I felt comfortable enough with both, I went ahead with making the life-3d web-app. I made the 3d simulation part first, and then added the home screen and routing. Finally, I wrapped up by adding style to the home screen and the UI elements in world.js.

#### Further Developments
- Adding other CA rulesets to the web-app
- Adding controls that would allow users to go through each generation step by step
- Storing a few generations in memory to allow users to rewind a little