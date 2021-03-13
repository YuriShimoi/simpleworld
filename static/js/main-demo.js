/** online demo: https://yurishimoi.github.io/simpleworld/ */

// VARIABLES
let engine = new Engine();
Engine.import("gridmapper.js");
Engine.import("gridmapper.css");
Engine.import("procedural.js");


// FUNCTIONS
function doMap(type, map){
  let pane = $(`.tab-pane[tab-id="${type}"]`);
  let size = parseInt(pane.find(`#${type}-size`).val());
  
  let mapping = new GridMapper(size, size, "", map);
  
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
  mapping.setMap(grid);
  mapping.print(1);
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
  doMap(type, map);
  let end  = new Date();

  $(this).parent().find("span.exec-time").html(`Generation time: ${(end-init)/1000}s`);
});


// WAKE UP
$(window).ready(function(){

});