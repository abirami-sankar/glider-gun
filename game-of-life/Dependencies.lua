--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

Code files and constants
]]


Class = require 'lib/class'
push = require 'lib/push'
Timer = require 'lib/knife.timer'

require 'src/Util'

require 'src/StateMachine'
require 'src/BaseState'
require 'src/StartState'
require 'src/RulesState'
require 'src/BeginGameState'
require 'src/PlayState'
--require 'src/GameOverState'

require 'src/Cell'
require 'src/World'

gFonts = {
    ['small'] = love.graphics.newFont('fonts/undertale-body.ttf', 8),
    ['medium'] = love.graphics.newFont('fonts/undertale-body.ttf', 16),
    ['large'] = love.graphics.newFont('fonts/undertale-body.ttf', 32),
    ['undertale'] = love.graphics.newFont('fonts/undertale-title.otf', 64),
    ['undertale-small'] = love.graphics.newFont('fonts/undertale-title.otf', 32)
}

gSounds = {
    ['select'] = love.audio.newSource('sounds/select.wav', 'static')
}

-- CONSTANTS

-- physical screen dimensions
WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 720

-- virtual resolution dimensions
VIRTUAL_WIDTH = 700
VIRTUAL_HEIGHT = 700

-- cell size
CELL_SIZE = 5

-- world dimensions
WORLD_SIZE = VIRTUAL_WIDTH / CELL_SIZE
