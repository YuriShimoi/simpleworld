/** Auxiliar class to build a 2D grid map 
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class GridMapper {
  _canvas      = null;
  _context     = null;
  _print_class = "JSMapEngine-GridMapper-canvas";
  _empty_color = "#111118";

  _map = null;

  constructor(size_x, size_y, empty="", container="body"){
    this.empty     = empty;
    this.size      = {'x':size_x, 'y':size_y};
    this.container = container;
    this.clearMap();
    this.mapping = {};
  }


  /** Set map as the given one
   * 
   * @param {Array} map 
   * @param {Boolean} resize - If this map needs to be resized to given map
   * @returns Treated map
   */
  setMap(map, resize=false){
    this._map = [...map]; // copy map
    if(resize) this.resize(map.length, map[0].length);
    else       this._clip();
    return this._map;
  }

  /** Empty the map
   * 
   */
  clearMap(){
    this._map = new Array(this.size.x).fill().map(e => new Array(this.size.y).fill(this.empty));
  }

  /** Resize and clip map with given x and y
   * 
   * @param {Number} x 
   * @param {Number} y 
   */
  resize(x, y){
    this.size = {'x':x, 'y':y};
    this._clip();
    $(this._canvas).attr('width',  this.size.x);
    $(this._canvas).attr('height', this.size.y);
  }

  /** Print this map on custom canvas
   * 
   * @param {Boolean | Number} normalize - If false has no normalize, else is a decimal cases
   */
  print(normalize = false){
    if(!this._canvas || !this._context) this._loadCanvas();

    this._context.fillStyle = this._empty_color;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    let render_map = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);

    let transpose = m => m[0].map((x,i) => m.map(x => x[i]));
    let map = transpose(this._map);
    if(normalize !== false) map = GridMapper.normalize(map, normalize);
    
    for(let x in this._map){
      for(let y in map[x]){
        if(map[x][y] === this.empty || map[x][y] == undefined) continue;
        let index = (parseInt(x) + parseInt(y) * this._canvas.width) * 4;
        
        let color_red   = null;
        let color_blue  = null;
        let color_green = null;
        if(map[x][y] in this.mapping){
          color_red   = this.mapping[map[x][y]][0];
          color_green = this.mapping[map[x][y]][1];
          color_blue  = this.mapping[map[x][y]][2];
        }
        else {
          let value = parseFloat(map[x][y]);
          let color = value < 0? 0: value > 1? 255: 255 * value;

          color_red   = color;
          color_green = color;
          color_blue  = color;
        }

        render_map.data[index + 0] = color_red;   // red
        render_map.data[index + 1] = color_green; // green
        render_map.data[index + 2] = color_blue;  // blue
        render_map.data[index + 3] = 255;         // alpha
      }
    }

    this._context.putImageData(render_map, 0, 0);
  }

  /** Normalize map on 0 to 1
   * 
   * @param {Array} map 
   * @param {Number} fixed - Number of decimal cases (default:{2})
   * @returns {Array} Normalized map
   */
  static normalize(map, fixed=2){
    let max = Math.max();
    let min = Math.min();
    map.forEach(x => max = max < Math.max(...x)? Math.max(...x):max);
    map.forEach(x => min = min > Math.min(...x)? Math.min(...x):min);

    map = map.map(x => x.map(y => y + (0 - min)) // push min value to 0
                        .map(y => parseFloat((y / (max + (0 - min))) // normalize by max value
                            .toFixed(fixed)) // fix decimal cases
                        )
                  );
    return map;
  }


  _loadCanvas(){
    let html = `<div class="${this._print_class}"><canvas class="canvas-pixelated" width="${this.size.x}" height="${this.size.y}"></canvas></div>`;
    $(this.container).append(html);

    this._canvas  = $(this.container).find(`.${this._print_class} > canvas`)[0];
    this._context = this._canvas.getContext("2d");
    this._context.imageSmoothingEnabled = false;

    if(this._canvas_interval == null){
      this._canvas_interval = setInterval(function(canvas){
        let wid = $(canvas).css("width");
        let hei = $(canvas).css("height");
        if(wid != hei) $(canvas).css("height", wid);
      }, 10, $(`.${this._print_class}`));
    }
  }

  _clip(){
    // fill X gap
    if(this._map.length < this.size.x){
      this._map = this._map.concat(new Array(this.size.x - this._map.length).fill().map(e => new Array(this.size.y).fill(this.empty)));
    }
    // fill Y gap
    for(let x in this._map){
      if(this._map[x].length < this.size.y){
        this._map[x] = this._map[x].concat(new Array(this.size.y - this._map[x].length).fill(this.empty));
      }
    }
    // cut extra lines
    this._map = this._map.splice(0, this.size.x).map(y => y.splice(0, this.size.y));
  }
}