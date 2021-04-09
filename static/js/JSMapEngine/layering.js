/** Special Display type properly make to treat layers
 * - Required GridMapper module
 * - Required Camera module
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class LayerDisplay { // CANNOT BE GridMapper EXTENDS BECAUSE DONT NECESSARIALY USE GRID POSITION
  _layer = [];

  constructor(container="body"){ // To layering canvases just put an array of Cameras and use just Display extended methods >:(
    this._container = $(container)[0];

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
  constructor(){
    
  }


}