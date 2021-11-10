--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

World.lua the game world where all the magic happens
]]

World = Class{}

function World:init()
	-- world dimensions
	self.width = WORLD_SIZE
	self.height = WORLD_SIZE

	-- initialise the 2d grid world
	self.map = {}
	self:initialiseMap()
end

function World:update(dt)
	-- first loop
	-- ignoring edge cases for sake of easier updates (will fix later)
	for y = 2, self.height - 1 do
		for x = 2, self.width - 1 do
			local cell = self.map[y][x]

			-- check all neighbors
			local neighbors = self:checkNeighbors(x,y)

			-- check with GOL ruleset and flag the cells 
			-- that would die/ be born in the next generation
			if cell.alive == 0 then
				if neighbors == 3 then
					cell.dead = false
				end
			elseif cell.alive == 1 then
				if neighbors == 3 or neighbors == 2 then
					cell.dead = false
				elseif neighbors > 3 then
					cell.dead = true
				elseif neighbors < 2 then
					cell.dead = true
				end
			end
		end
	end

	-- second loop
	-- based on the flag change the state of all the cells
	for y = 2, self.height - 1 do
		for x = 2, self.width - 1 do
			local cell = self.map[y][x]

			if cell.dead then 
				cell.alive = 0
			else
				cell.alive = 1
			end
		end
	end
end

function World:render()
	for y = 1, self.height do
		for x = 1, self.width do
			local cell = self.map[y][x]
			cell:render()
		end
	end
end

function World:initialiseMap()
	-- all cells are dead in the initial state to allow users to make their own patterns
	for y = 1, self.height do
		table.insert(self.map, {})
		for x = 1, self.width do
			table.insert(self.map[y], Cell((x-1) * CELL_SIZE, (y-1) * CELL_SIZE))
		end
	end
end

function World:checkNeighbors(x,y)
	local sum = 0

	-- loop over the Moore neighbors of each cell
	for i = -1, 1 do
		for j = -1, 1 do
			sum = sum + self.map[y + i][x + j].alive
		end
	end

	sum = sum - self.map[y][x].alive

	return sum
end
