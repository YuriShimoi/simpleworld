/** Core of visual treatments on engine
 * 
 * All method names initializing with _ are for internal use of the class only
 */
class Display {
  #container    = null;
  #canvas       = null;
  #context      = null;

  #canvas_class = "JSME-canvas";
  #properties   = {
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
  createCanvas(prop={}){
    if(!this.#container) return false;

    prop['class'] = 'class' in prop? `${prop.class} ${this.#canvas_class}`: this.#canvas_class;
    prop = {...this.#properties, ...prop};
    
    let properties = "";
    for(let p in prop){
      properties += `${p}="${prop[p]}" `;
    }

    let canvas = `<canvas ${properties}></canvas>`;

    if(this.#canvas) this.#canvas.remove();
    $(this.#container).append(canvas);
    this.#canvas = $(this.#container).find(`.${this.#canvas_class}`)[0];

    this.#context = this.#canvas.getContext("2d");

    return this.#canvas;
  }


  _draw(draw_obj){
    if(!this.#canvas || !this.#context) return false;

    // drawimage > (image, clip_start_x, clip_start_y, clip_size_x, clip_size_y, canvas_x, canvas_y, size_x, size_y)
    // context.drawImage(
    //   element.img,
    //   element.startX,
    //   element.startY,
    //   element.sizeX,
    //   element.sizeY,
    //   element.posX - cam.posX,
    //   element.posY - cam.posY,
    //   element.img_sizeX,
    //   element.img_sizeY
    // );
  }
}


/** Object with a serie of properties needed to draw in Display canvas
 * 
 * All method names initializing with _ are for internal use of the class only
 */
class DrawObject {
  

  constructor(){
    this.img       = ""; // convert to blob
    this.imgsize_x = 0;
    this.imgsize_y = 0;
    this.size_x    = 0;
    this.size_y    = 0;
  }
}