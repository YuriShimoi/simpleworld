/** online demo: https://yurishimoi.github.io/simpleworld/ */

// VARIABLES
let engine = new Engine();
Engine.import("gridmapper.js");
Engine.import("gridmapper.css");
Engine.import("procedural.js");
let canvas_div = $(".mapping-canvas")[0];


// FUNCTIONS



// TRIGGERS



// WAKE UP
$(window).ready(function(){
  let size = 400;

  let mapping   = new GridMapper(size, size, "", canvas_div);
  let perl_grid = GridProcedure.generate("perlin", {'x':size, 'y':size});
  let drnk_grid = GridProcedure.generate("drunken", {'x':size, 'y':size});
  GridProcedure.prop.cellular.basis        = 0.2;
  GridProcedure.prop.cellular.iterations   = 80;
  GridProcedure.prop.cellular.initial_drop = 0.02;
  GridProcedure.prop.cellular.variants     = [0.4,0.6,0.8];
  let cell_grid = GridProcedure.generate("cellular", {'x':size, 'y':size});

  perl_grid = GridMapper.normalize(perl_grid, 1);
  let grid  = perl_grid.map((vx, x) => vx.map((vy, y) => drnk_grid[x][y] == 0? 0: parseFloat(vy) > 0.65? 1: cell_grid[x][y]));

  mapping.setMap(grid);
  mapping.print();
});