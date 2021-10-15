--[[
October 14th 2021

Author: Abirami Sankar

implementing Conway's Game of Life

Util.lua with all the helper functions
]]


function renderGrid()
	love.graphics.setColor(0.7, 0.7, 0.7, 0.4)
	for y = 1, WORLD_SIZE do
		for x = 1, WORLD_SIZE do
			love.graphics.rectangle("line", (x-1) * CELL_SIZE, (y-1) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
		end
	end
end

-- takes in the x and y coordinates and returns the cell thats present there
function pointToCell(x, y, world)    
	if x < 1 or x > VIRTUAL_WIDTH or y < 0 or y > VIRTUAL_HEIGHT then
        return nil
    end

    return world.map[math.floor(y / CELL_SIZE) + 1][math.floor(x / CELL_SIZE) + 1]
end