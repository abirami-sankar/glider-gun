--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

StartState.lua simple starting screen
]]

StartState = Class{__includes = BaseState}

function StartState:init()
	-- helps us achieve the fade in and out transitions
	self.transitionAlpha = 0
end

function StartState:update(dt)
    if love.keyboard.wasPressed('escape') then
        love.event.quit()
    end

    if love.keyboard.wasPressed('enter') or love.keyboard.wasPressed('return') then
        gSounds['select']:play()

        Timer.tween(0.5, { [self] = {transitionAlpha = 1} }
        	):finish(function()
        		-- fade to black before going to next state
        		gStateMachine:change('rules')
        	end)
    end

    Timer.update(dt)
end

function StartState:render()
	-- layer-1: text 
    love.graphics.setColor(1, 1, 1, 1)
	love.graphics.setFont(gFonts['large'])
    love.graphics.printf("Conway's", 0, VIRTUAL_HEIGHT / 2 - 60, VIRTUAL_WIDTH, 'center')

	love.graphics.setFont(gFonts['undertale'])
    love.graphics.printf('Game of Life', 2, VIRTUAL_HEIGHT / 2 - 15, VIRTUAL_WIDTH, 'center')

    love.graphics.setFont(gFonts['large'])
    love.graphics.printf('Press Enter', 0, VIRTUAL_HEIGHT / 2 + 64, VIRTUAL_WIDTH, 'center')

    -- layer-2: transition rectangle
    love.graphics.setColor(0,0,0,self.transitionAlpha)
    love.graphics.rectangle('fill', 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)
end