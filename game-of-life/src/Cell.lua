--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

Cell.lua 
]]

Cell = Class{}

function Cell:init(x,y)
	-- maintains current state of the cell
	self.alive = 0

	-- secondary flag to allow us to do simultaneous updates
	self.dead = 1

	-- cell dimensions
	self.width = CELL_SIZE
	self.height = CELL_SIZE
	self.x = x
	self.y = y
end

function Cell:update(dt)
	-- body
end

function Cell:render()
	-- render cells only if they are alive
	if self.alive == 1 then
		love.graphics.setColor(1,1,1,1)
		love.graphics.rectangle("fill",self.x,self.y,self.width,self.height)
	end
end