/** Special Display type properly make to treat layers
 *  - Required GridMapper module
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class LayerDisplay extends GridMapper {
  _layer = [];

  constructor(size_x, size_y, empty="", container="body"){
    super(size_x, size_y, empty, container);

  }

  layer(n, map=null){
    if(map === null) return this._layer[n];

    this._layer[n] = new Layer(map, parseFloat(this._properties.width), parseFloat(this._properties.height));
  }
}

/** Layer object what have individual layer properties and map
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class Layer {
  constructor(map, width, height){
    this.map = map;
    this._size = {
      'width' : width,
      'height': height
    };
  }


}