/** online demo: https://yurishimoi.github.io/simpleworld/procedure-demo.html */

// VARIABLES
let engine = new Engine();
Engine.import("gridmapper.js");
Engine.import("gridmapper.css");
Engine.import("procedural.js");


// FUNCTIONS
function doMap(type, map, need_print=true){
  let pane = $(`.tab-pane[tab-id="${type}"]`);
  let size = parseInt(pane.find(`#${type}-size`).val());
  
  let inputs = pane.find("input");
  for(let i=0; i < inputs.length; i++){
    let input = $(inputs[i]);
    let key   = null;
    let value = null;

    let input_id = $(inputs[i]).attr("id");
    switch(input_id){
      case 'perlin-frequency':
        key   = "frequency";
        value = parseInt(input.val());
        break;
      case 'cellular-iterations':
        key   = "iterations";
        value = parseInt(input.val());
        break;
      case 'cellular-drop':
        key   = "initial_drop";
        value = parseInt(input.val()) / 100;
        break;
      case 'cellular-basis':
        key   = "basis";
        value = parseInt(input.val());
        break;
      case 'cellular-variants':
        key   = "variants";
        value = input.val().split(',').map(x => parseFloat(x));
        break;
      case 'cellular-dissemination':
        key   = "dissemination";
        value = parseInt(input.val());
        break;
      case 'cellular-smooth':
        key   = "smooth";
        value = parseInt(input.val());
        break;
      case 'cellular-check':
        key   = "random_check";
        value = parseInt(input.val()) / 100;
        break;
      case 'drunken-paths':
        key   = "paths";
        value = parseInt(input.val());
        break;
      case 'drunken-length':
        key   = "length";
        value = parseInt(input.val()) / 100;
        break;
      case 'drunken-carver':
        key   = "carver";
        value = parseInt(input.val());
        break;
      case 'drunken-basis':
        key   = "basis";
        value = parseInt(input.val());
        break;
      case 'drunken-smooth':
        key   = "smooth";
        value = parseInt(input.val());
        break;
      case 'drunken-border':
        key   = "border";
        value = parseInt(input.val());
        break;
      case 'drunken-filler':
        key   = "filler";
        value = parseFloat(input.val()) / 100;
        break;
      case 'drunken-additive':
        key   = "additive";
        value = input.prop("checked");
        break;
    }

    GridProcedure.prop[type][key] = value;
  }

  let grid = GridProcedure.generate(type, {'x':size,'y':size});
  if(need_print){
    let mapping = new GridMapper(size, size, "", map);
    mapping.setMap(grid);
    mapping.print(1);
  }
  return grid;
}


// TRIGGERS
$(".nav-link").click(function(){
  $(this).parents(".nav").find(".nav-link").removeClass("active");
  $(this).addClass("active");
  let target     = $(this).attr("target");
  let target_tab = $(`.tab-pane[tab-id="${target}"]`);
  target_tab.parents(".tab-content").find(`.tab-pane`).removeClass("active");
  target_tab.addClass("active");

  $(".map-space").removeClass("active");
  $(`#${target}-map`).addClass("active");
});

$('input[type="range"]').on("input", function(){
  let id    = $(this).attr("id");
  let value = $(this).val();
  let step  = $(this).attr("step");
  if(step && step.includes('.')) value = parseFloat(value).toFixed(step.split('.')[1].length);
  $(`label[for="${id}"]`).html(value);
});

$(".gen-map").click(function(){
  let type = $(this).parent().attr("tab-id");
  let map  = $(`#${type}-map`);
  map.html("");

  let init = new Date();
  if(type.includes('-')){
    let grids = {};
    for(let t in type.split('-')){
      let t_type    = type.split('-')[t];
      grids[t_type] = doMap(t_type, map, false);
    }

    let grid = [];
    let minimum = Math.min();
    if('perlin' in grids){
      grid = GridMapper.normalize(grids['perlin']);
      if('cellular' in grids){
        grid = grid.map((_, x) => grid[x].map((v, y) => parseFloat(v) + parseFloat(grids['cellular'][x][y])));
      }
      else minimum = -0.05;
    }
    else {
      grid = grids['cellular'];
    }
    if('drunken' in grids){
      for(let x=0; x < grid.length; x++){
        for(let y=0; y < grid[x].length; y++){
          if(grids['drunken'][x][y] === GridProcedure.prop.drunken.basis){
            grid[x][y] = '#';
          }
          else if(parseFloat(grid[x][y]) < minimum) minimum = parseFloat(grid[x][y]);
        }
      }
      grid = grid.map(x => x.map(y => y === '#'? minimum-Math.abs(minimum/2): y));
    }
    let size = grid.length;
    let mapping = new GridMapper(size, size, "", map);
    mapping.setMap(grid);
    mapping.print(1);
  }
  else {
    doMap(type, map);
  }
  let end  = new Date();

  $(this).parent().find("span.exec-time").html(`Generation time: ${(end-init)/1000}s`);
});


// WAKE UP
$(window).ready(function(){

});