/** Camera object what use Display to do positioning behaviors
 * - Required Display module
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class Camera extends Display {
  _anchor = null;

  constructor(e=null, screen_width=1280, screen_height=720, pos_x=0, pos_y=0, scale=1){
    super(e);

    this._pos = {
      'x': pos_x,
      'y': pos_y
    };
    this._properties.width  = screen_width;
    this._properties.height = screen_height;
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

  /** Draw the DrawObject on context
   * @override Display.draw(draw_obj)
   * 
   * @param {DrawObject | [DrawObject]} draw_obj 
   * @returns If has no canvas or context set, will return false
   */
  draw(draw_obj){
    if(!this._canvas || !this._context) return false;

    if(draw_obj instanceof DrawObject) draw_obj = [draw_obj];

    let render_count = 0;
    for(let d in draw_obj){
      // drawimage > (image, clip_start_x, clip_start_y, clip_size_x, clip_size_y, canvas_x, canvas_y, size_x, size_y)
      if(this._onScreen(draw_obj[d].pos.x, draw_obj[d].pos.y, draw_obj[d].render.size.x, draw_obj[d].render.size.y)){
        render_count++;
        this._context.drawImage(
          draw_obj[d].render.img,
          draw_obj[d].render.img.start.x,
          draw_obj[d].render.img.start.y,
          draw_obj[d].render.img.size.x,
          draw_obj[d].render.img.size.y,
          draw_obj[d].pos.x - this._pos.x,
          draw_obj[d].pos.y - this._pos.y,
          draw_obj[d].render.size.x,
          draw_obj[d].render.size.y
        );
      }
    }
    return render_count;
  }

  /** Returns 'x' and 'y' camera position
   * 
   * @returns {object} Dict with 'x' and 'y' properties
   */
  pos(){
    return {'x': this._posX(), 'y': this._posY()};
  }

  /** Move camera to anchor if has one, or to given position
   * 
   * @param {Number} pos_x 
   * @param {Number} pos_y 
   * @param {Boolean} additive - If is additive to actual position
   */
  move(pos_x=null, pos_y=null, additive=false){ // TODO: PREVENT PRINT OUTSIDE OF GIVEN AREA
    if(pos_x !== null && pos_y !== null){
      this._pos = additive? {'x':this._pos.x + pos_x, 'y':this._pos.y + pos_y}:{'x':pos_x, 'y':pos_y};
    }
    else if(this._anchor !== null){
      this._pos.x = this._anchor.pos.x;
      this._pos.y = this._anchor.pos.y;
    }
  }


  _posX(){
    if(this._anchor === null) return this._pos.x;
    
    let anchor_center = this._anchor.pos.x - this._anchor.render.size.x / 2;
    this._pos.x = anchor_center - this.screen_width / 2;
    return this._pos.x;
  }
  
  _posY(){
    if(this._anchor === null) return this._pos.y;
    
    let anchor_center = this._anchor.pos.y - this._anchor.render.size.y / 2;
    this._pos.y = anchor_center - this.screen_height / 2;
    return this._pos.y;
  }

  _onScreen(px, py, sx, sy){
    let campx = this.pos().x;
    let campy = this.pos().y;
    let camsx = this._properties.width;
    let camsy = this._properties.height;
    return ((px <= (campx + camsy) && (px + sy) >= campx) &&
            (py <= (campy + camsx) && (py + sx) >= campy));
  }
}