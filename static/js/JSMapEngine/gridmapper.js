/** Auxiliar class to build a 2D grid map 
 * 
 * All method names initializing with _ are for internal use of the class only
 */
class GridMapper {
  #canvas      = null;
  #context     = null;
  #print_class = "JSMapEngine-GridMapper-canvas";
  #empty_color = "#111118";

  #map = null;

  constructor(size_x, size_y, empty=""){
    this.empty = empty;
    this.size  = {'x':size_x, 'y':size_y};
    this.clearMap();
  }


  /** Set map as the given one
   * 
   * @param {Array} map 
   * @returns Treated map
   */
  setMap(map){
    this.#map = [...map]; // copy map
    this._clip();
    return this.#map;
  }

  /** Empty the map
   * 
   */
  clearMap(){
    this.#map = new Array(this.size.x).fill().map(e => new Array(this.size.y).fill(this.empty));
  }

  /** Resize and clip map with given x and y
   * 
   * @param {Number} x 
   * @param {Number} y 
   */
  resize(x, y){
    this.size = {'x':x, 'y':y};
    this._clip();
    $(this.#canvas).attr('width',  this.size.x);
    $(this.#canvas).attr('height', this.size.y);
  }

  /** Print this map on custom canvas
   * 
   * @param {Boolean | Number} normalize - if false has no normalize, else is a decimal cases
   */
  print(normalize = false){
    if(!this.#canvas || !this.#context) this._loadCanvas();

    this.#context.fillStyle = this.#empty_color;
    this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

    let render_map = this.#context.getImageData(0, 0, this.#canvas.width, this.#canvas.height);

    let transpose = m => m[0].map((x,i) => m.map(x => x[i]));
    let map = transpose(this.#map);
    if(normalize !== false) map = GridMapper.normalize(map, normalize);
    
    for(let x in this.#map){
      for(let y in map[x]){
        if(map[x][y] === this.empty || map[x][y] == undefined) continue;
        let value = parseFloat(map[x][y]);
        let index = (parseInt(x) + parseInt(y) * this.#canvas.width) * 4;
        let color = value < 0? 0: value > 1? 255: 255 * value;

        render_map.data[index + 0] = color; // red
        render_map.data[index + 1] = color; // green
        render_map.data[index + 2] = color; // blue
        render_map.data[index + 3] = 255;   // alpha
      }
    }

    this.#context.putImageData(render_map, 0, 0);
  }

  /** Normalize map on 0 to 1
   * 
   * @param {Array} map 
   * @param {Number} fixed - number of decimal cases (default:{2})
   * @returns 
   */
  static normalize(map, fixed=2){
    let max = Math.max();
    map.forEach(x => max = max < Math.max(...x)? Math.max(...x):max);
    map = map.map(x => x.map(y => parseFloat((y / max).toFixed(fixed))));
    return map;
  }


  _loadCanvas(){
    let html = `<canvas class="${this.#print_class} canvas-pixelated" width="${this.size.x}" height="${this.size.y}"></canvas>`;
    $("body").append(html);

    this.#canvas  = $(`.${this.#print_class}`)[0];
    this.#context = this.#canvas.getContext("2d");
    this.#context.imageSmoothingEnabled = false;
  }

  _clip(){
    // fill X gap
    if(this.#map.length < this.size.x){
      this.#map = this.#map.concat(new Array(this.size.x - this.#map.length).fill().map(e => new Array(this.size.y).fill(this.empty)));
    }
    // fill Y gap
    for(let x in this.#map){
      if(this.#map[x].length < this.size.y){
        this.#map[x] = this.#map[x].concat(new Array(this.size.y - this.#map[x].length).fill(this.empty));
      }
    }
    // cut extra lines
    this.#map = this.#map.splice(0, this.size.x).map(y => y.splice(0, this.size.y));
  }
}