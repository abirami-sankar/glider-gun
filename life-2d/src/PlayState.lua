--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

PlayState.lua to handle inputs and update the game world 
]]

PlayState = Class{__includes = BaseState}

function PlayState:init()
	-- helps us achieve the fade in and out transitions
	self.transitionAlpha = 0

	self.paused = false
end

function PlayState:enter(def)
	-- body
	self.world = def.world
end

function PlayState:update(dt)
	-- input handling
	if self.paused then
        if love.keyboard.wasPressed('space') then
            self.paused = false
            gSounds['select']:play()
        else
            return
        end
    elseif love.keyboard.wasPressed('space') then
        self.paused = true
        gSounds['select']:play()
        return
    end

    if love.keyboard.wasPressed('r') then
    	gSounds['select']:play()

        Timer.tween(0.5, { [self] = {transitionAlpha = 1} }
        	):finish(function()
        		-- fade to black before going to next state
        		gStateMachine:change('begin-game')
        	end)
    end

	self.world:update(dt)

	Timer.update(dt)
end

function PlayState:render()
	self.world:render()

  	-- transition rectangle
    love.graphics.setColor(0,0,0,self.transitionAlpha)
    love.graphics.rectangle('fill', 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)
end