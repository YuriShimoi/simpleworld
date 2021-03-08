/** Core of visual treatments on engine
 * 
 * All method names initializing with _ are for internal use of the class only
 */
class Display {
  #container    = null;
  #canvas       = null;
  #context      = null;

  #canvas_class    = "JSME-canvas";
  #pixelated_class = "canvas-pixelated";
  #properties      = {
    'width'        : "1280",
    'height'       : "720",
    'class'        : this.#canvas_class,
    'oncontextmenu': "return false" // cancel mouse right click menu
  };

  constructor(e=null){
    this.#container = $(e)[0];
  }


  /** Creates the canvas with some internal properties in addition to the optional given ones
   * 
   * @param {Object} prop - E.g. {class:"my_class", id:"my_id", width:"640", height:"360"}
   * @returns {HTMLElement} reference to canvas
   */
  createCanvas(prop={}, pixelated=true){
    if(!this.#container) return false;

    prop['class'] = 'class' in prop? `${prop.class} ${this.#canvas_class}`: this.#canvas_class;
    prop = {...this.#properties, ...prop};
    
    if(pixelated) prop.class += ` ${this.#pixelated_class}`;

    let properties = "";
    for(let p in prop){
      properties += `${p}="${prop[p]}" `;
    }

    let canvas = `<canvas ${properties}></canvas>`;

    if(this.#canvas) this.#canvas.remove();
    $(this.#container).append(canvas);
    this.#canvas = $(this.#container).find(`.${this.#canvas_class}`)[0];

    this.#context = this.#canvas.getContext("2d");
    this.#context.imageSmoothingEnabled = !pixelated;

    return this.#canvas;
  }

  /** Draw the DrawObject on context
   * 
   * @param {DrawObject} draw_obj 
   * @returns If has no canvas or context set, will return false
   */
  draw(draw_obj){
    if(!this.#canvas || !this.#context) return false;

    // drawimage > (image, clip_start_x, clip_start_y, clip_size_x, clip_size_y, canvas_x, canvas_y, size_x, size_y)
    this.#context.drawImage(
      draw_obj.render.img,
      draw_obj.render.img.start.x,
      draw_obj.render.img.start.y,
      draw_obj.render.img.size.x,
      draw_obj.render.img.size.y,
      draw_obj.pos.x,
      draw_obj.pos.y,
      draw_obj.render.size.x,
      draw_obj.render.size.y
    );
  }
}


/** Object with a serie of properties needed to draw in Display canvas
 * 
 * All method names initializing with _ are for internal use of the class only
 */
class DrawObject {
  constructor(render, pos_x, pos_y){
    this.render = render;
    this.move(pos_x, pos_y);
  }


  /** Move object to given position
   * 
   * @param {Number} pos_x 
   * @param {Number} pos_y 
   * @param {Boolean} additive - if is additive to actual position
   */
  move(pos_x, pos_y, additive = false){
    this.pos = additive? {'x':this.pos.x + pos_x, 'y':this.pos.y + pos_y}:{'x':pos_x, 'y':pos_y};
  }
}


/** Object with image properties to be right clipped on canvas
 * 
 * All method names initializing with _ are for internal use of the class only
 */
class RenderObject {
  constructor(img, size_x, size_y){
    this.img     = new Image;
    this.img.ref = this;
    this.img.onload = function(){
      this.ref.clip(0, 0, this.width, this.height);
      delete this.ref;
    }
    this.img.src = img;
    this.size    = {'x':size_x, 'y':size_y};
  }


  /** Set image clip properties
   * 
   * @param {Number} start_x 
   * @param {Number} start_y 
   * @param {Number} size_x 
   * @param {Number} size_y 
   */
  clip(start_x, start_y, size_x, size_y){
    this.img.size  = {'x':size_x,  'y':size_y};
    this.img.start = {'x':start_x, 'y':start_y};
  }
}