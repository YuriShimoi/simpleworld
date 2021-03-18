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
  let size = 200;

  let mapper   = new GridMapper(size, size, "", canvas_div);
  let perl_grid = GridProcedure.generate("perlin", {'x':size, 'y':size});
  // GridProcedure.prop.drunken.filler = 0.7;
  // GridProcedure.prop.drunken.smooth = 10;
  // let drnk_grid = GridProcedure.generate("drunken", {'x':size, 'y':size});
  GridProcedure.prop.cellular.basis        = 0.2;
  GridProcedure.prop.cellular.iterations   = 80;
  GridProcedure.prop.cellular.initial_drop = 0.02;
  GridProcedure.prop.cellular.variants     = [0.4,0.6,0.8];
  let cell_grid = GridProcedure.generate("cellular", {'x':size, 'y':size});

  perl_grid = GridMapper.normalize(perl_grid, 2);
  // let grid  = perl_grid.map((vx, x) => vx.map((vy, y) => drnk_grid[x][y] == 0? 0: parseFloat(vy) > 0.65? 1: cell_grid[x][y]));
  spawn_choices = [];
  let savePoint = (x,y) => {spawn_choices.push([x,y]); return 2;}
  let grid  = perl_grid.map((vx, x) => vx.map((vy, y) => parseFloat(vy) > 0.65? parseFloat(vy) > 0.68? 1: 0.9: parseFloat(vy) < 0.05? savePoint(x,y):cell_grid[x][y]));
  
  // spawn on a random gray point
  let [sx, sy] = spawn_choices[Math.floor(Math.random()*spawn_choices.length)];
  grid[sx][sy] = 3;

  mapper.setMap(grid);
  mapper.color_mapping = {
    '0'  : "",
    '3'  : [255,   0,   0],
    '2'  : [100, 100, 100],
    '1'  : [ 40, 150, 215],
    '0.9': [ 80, 190, 255],
    '0.2': [100, 255, 120],
    '0.4': [ 20, 100,  50],
    '0.6': [ 80, 200, 110],
    '0.8': [ 50, 180,  80]
  }

  let rd = new RenderObject(mapper.print(), 3200, 3200);

  rd.onLoad(function(render){
    draw_object = new DrawObject(render, 0,0);
  
    display_map = new Display($("#content"));
    display_map.createCanvas();
    display_map.draw(draw_object);
  });
});