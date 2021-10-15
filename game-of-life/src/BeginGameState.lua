--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

BeginGameState.lua that lets users generate their own patterns
]]

BeginGameState = Class{__includes = BaseState}

function BeginGameState:init()
	-- helps us achieve the fade in and out transitions
	self.transitionAlpha = 1

	-- initialising world with all dead cells
	self.world = World()
end

function BeginGameState:enter()
	-- fade out while entering the state
	Timer.tween(0.5, {
        [self] = {transitionAlpha = 0}
    })
end

function BeginGameState:update(dt)
	-- make the cell alive or dead when mouse is clicked
	if love.mouse.wasPressed(1) then
		local mouseX, mouseY = love.mouse.getPosition()

		-- since we're pusing a virtual resolutuion while rendering,
		-- push the virtual resolutuion while handling mouse input 
		-- to avoid errors with cursor postition
		mouseX, mouseY = push:toGame(mouseX, mouseY)
		
		local cell = pointToCell(mouseX, mouseY, self.world)

		if cell.alive == 0 then
			cell.alive = 1
		else
			cell.alive = 0
		end
	end

	if love.keyboard.wasPressed('enter') or love.keyboard.wasPressed('return') then
        gSounds['select']:play()
       	gStateMachine:change('play', { world = self.world })

    end

    if love.keyboard.wasPressed('escape') then
        love.event.quit()
    end

	Timer.update(dt)
end

function BeginGameState:render()
	self.world:render()

  	-- transition rectangle
    love.graphics.setColor(0,0,0,self.transitionAlpha)
    love.graphics.rectangle('fill', 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)
end