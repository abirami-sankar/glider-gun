--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

RulesState.lua for people who don't know the ruleset of GOL
and to instruct users on input controls
]]

RulesState = Class{__includes = BaseState}

function RulesState:init()
	-- helps us achieve the fade in and out transitions
	self.transitionAlpha = 1
end

function RulesState:enter()
    -- fade out while entering
    Timer.tween(0.5, {
        [self] = {transitionAlpha = 0}
    })
end

function RulesState:update(dt)
    if love.keyboard.wasPressed('escape') then
        love.event.quit()
    end

    if love.keyboard.wasPressed('enter') or love.keyboard.wasPressed('return') then
        gSounds['select']:play()

        Timer.tween(0.5, { [self] = {transitionAlpha = 1} }
        	):finish(function()
        		-- fade to black before going to next state
        		gStateMachine:change('begin-game')
        	end)
    end

    Timer.update(dt)
end

function RulesState:render()

	-- layer-1: text 
    love.graphics.setColor(1, 1, 1, 1)
	love.graphics.setFont(gFonts['large'])
    love.graphics.printf("How to interact", 0, 150, VIRTUAL_WIDTH, 'center')

    love.graphics.setFont(gFonts['medium'])
    love.graphics.printf("1. Click on a cell to make it alive. Click again to clear the cell", 0, 200, VIRTUAL_WIDTH, 'center')
    love.graphics.printf("2. If satisfied with pattern, press Enter to continue", 0, 220, VIRTUAL_WIDTH, 'center')
    love.graphics.printf("3. Press R to try with a new pattern, press space to pause", 0, 240, VIRTUAL_WIDTH, 'center')

    love.graphics.setFont(gFonts['large'])
    love.graphics.printf("Game World Rules", 0, 300, VIRTUAL_WIDTH, 'center')

    love.graphics.setFont(gFonts['medium'])
    love.graphics.printf("1. A Cell can be either alive or dead", 0, 350, VIRTUAL_WIDTH, 'center')
    love.graphics.printf("2. Every Cell interacts with its 8 neighbors", 0, 370, VIRTUAL_WIDTH, 'center')
    love.graphics.printf("3. Any live cell with two or three live neighbours survives", 0, 390, VIRTUAL_WIDTH, 'center')
    love.graphics.printf("4. Any dead cell with three live neighbours becomes a live cell", 0, 410, VIRTUAL_WIDTH, 'center')
    love.graphics.printf("5. All other live cells die in the next generation,", 0, 430, VIRTUAL_WIDTH, 'center')
    love.graphics.printf("6. All other dead cells stay dead.", 0, 450, VIRTUAL_WIDTH, 'center')
	
    love.graphics.setColor(1, 1, 1, 0.8)
    love.graphics.setFont(gFonts['large'])
    love.graphics.printf('Press Enter', 0, 500, VIRTUAL_WIDTH, 'center')

    -- layer-2: transition rectangle
    love.graphics.setColor(0,0,0,self.transitionAlpha)
    love.graphics.rectangle('fill', 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)
end