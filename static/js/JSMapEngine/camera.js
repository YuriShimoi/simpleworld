/** 
 * - Required Display module
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class Camera extends Display {
  _anchor = null;

  constructor(e=null, pos_x, pos_y, screen_width, screen_height, scale){
    super(e);
    this.pos = {
      'x': this._posX,
      'y': this._posY
    }
    this._pos = {
      'x': pos_x,
      'y': pos_y
    }
    this.screen = {
      'width' : screen_width,
      'height': screen_height
    }
    this.scale = scale;
  }

  /** Anchor camera with the center of targeted object
   * 
   * @param {DrawObject|InteractiveObject} target 
   * @returns {DrawObject|InteractiveObject} Returns actual anchor if has no given target
   */
  anchor(target=null){
    if(target == null) return this._anchor;
    this._anchor = target;
  }


  _posX(){
    if(this._anchor !== null) return this._pos.x;
    
    let anchor_center = this._anchor.pos.x - this._anchor.render.size.x / 2;
    this._pos.x = anchor_center - this.screen_width / 2;
    return this._pos.x;
  }
  
  _posY(){
    if(this._anchor !== null) return this._pos.y;
    
    let anchor_center = this._anchor.pos.y - this._anchor.render.size.y / 2;
    this._pos.y = anchor_center - this.screen_height / 2;
    return this._pos.y;
  }
}