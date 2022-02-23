*Abirami Sankar*
*Country: India*
*Year: 2021*

## Life-2d
#### implementing GOL in Lua

I put together a little game where users can draw a starting configuration and see a GOL simulation playout on a finite 2d grid. The code for this is written in Lua and is executed with the help of the game engine Love2D. 

The code files are:
- Main.lua
- Dependencies.lua
- Util.Lua
- StateMachine.Lua
- BaseState.Lua
- StartState.Lua
- RulesState.Lua
- BeginGameState.Lua
- PlayState.Lua
- World.Lua
- Cell.Lua 

The code logic is organised in states and uses a state machine to transition between states. The state machine keeps track of the current state. At any given point in time, only one state is active. Each state has some interaction or event that will trigger a transition into the next state.

- Base State – is the parent class, it contains empty function definitions which can be overwritten as needed. The 4 main states in the game all inherit from Base State
- Start State- a simple title screen that prompts for user input to continue
- Rules State- the Start State transitions into the rules state upon user input. The Rules State informs users how to interact with the simulation and describes the rules that govern Conway’s GOL. 
- Begin Game State- is where users can draw initial state configuration for running GOL
- Play State- uses the GOL ruleset to run the simulation on the initial seed configuration provided by the user in Begin Game

The Cell class maintains its own state (whether it is alive or not) and takes care of rendering itself to the screen. The World class contains a 2d array of cells. In each frame, it iterates over all the cells in the 2d grid and updates the state of each cell based on the GOL rules. There are two helper functions defined in util.lua that draw the 2d grid to the screen and point to a cell in the world given the x-y coordinates. Dependencies.lua takes care of including all files needed in a single place to make things neater. Finally, there is main.lua where the screen, state machine, input tables etc. are set up.

In this project, I also made use of the following libraries:
- Class.lua – to make it easier to write custom classes
- Push.lua - to set up the virtual screen, handle resizing the window etc.
- Timer.lua from the knife library – to enable fade transitions over time between states	

Further developments to work on
- add mouse hold, drag and draw features
- allow pause and rewind
- make the world an infinite grid
