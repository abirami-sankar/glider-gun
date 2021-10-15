--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

The Game of Life, also known simply as Life, is a cellular automaton devised 
by the British mathematician John Horton Conway in 1970.[1] It is a zero-player game, 
meaning that its evolution is determined by its initial state, requiring no further input. 
One interacts with the Game of Life by creating an initial configuration and observing how it 
evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.

The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, 
(for the sake of this implementation, the grid size is fixed) each of which is in one of two 
possible states, live or dead, (or populated and unpopulated, respectively). 
Every cell interacts with its eight neighbours, which are the cells that are horizontally, 
vertically, or diagonally adjacent. At each step in time, the following transitions occur:

Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
]]

-- initialize our nearest-neighbor filter
love.graphics.setDefaultFilter('nearest', 'nearest')

-- global constant variables and all the code files are found here
require 'Dependencies'

function love.load()
    
    -- window bar title
    love.window.setTitle('Game of Life')

    -- initialize our virtual resolution
    push:setupScreen(VIRTUAL_WIDTH, VIRTUAL_HEIGHT, WINDOW_WIDTH, WINDOW_HEIGHT, {
        vsync = true,
        fullscreen = false,
        resizable = true,
        canvas = true
    })

    -- initialize state machine with all state-returning functions
    gStateMachine = StateMachine {
        ['start'] = function() return StartState() end,
        ['rules'] = function() return RulesState() end,
        ['begin-game'] = function() return BeginGameState() end,
        ['play'] = function() return PlayState() end
        --['game-over'] = function() return GameOverState() end
    }
    gStateMachine:change('start')

    -- initialize input table
    love.keyboard.keysPressed = {}
    love.mouse.keysPressed = {}
end

function love.resize(w, h)
    push:resize(w, h)
end

function love.keypressed(key)
    
    -- add to our table of keys pressed this frame
    love.keyboard.keysPressed[key] = true
end

function love.keyboard.wasPressed(key)
    if love.keyboard.keysPressed[key] then
        return true
    else
        return false
    end
end

function love.mousepressed(x, y, key)
    -- gets called everytime mouse is clicked
    love.mouse.keysPressed[key] = true
end

function love.mouse.wasPressed(key)
    return love.mouse.keysPressed[key]
end

function love.update(dt)
    gStateMachine:update(dt)

    -- clear all input tables for the next update cycle
    love.keyboard.keysPressed = {}
    love.mouse.keysPressed = {}
end

function love.draw()
    push:start()    

    -- draw the base grid across all states
    renderGrid()

    gStateMachine:render()

    push:finish()
end