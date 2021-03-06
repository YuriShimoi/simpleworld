/** Grapper who hold mouse and keyboard input events */
class InputGrapper {
  #container = null;

  constructor(e='body'){
    this.#container = $(e)[0];

    this.keyboard = new Grapper(this.#container, "keyup", "keydown");
    this.mouse    = new Grapper(this.#container, "mouseup", "mousedown");
  }

  /** Change element references, inflicts directly on mouse grapper coordinates
   * 
   * @param {HTMLElement} e
   * @returns {HTMLElement} self container
   */
  container(e){
    this.#container = $(e)[0];

    this.mouse.container(this.#container);
    this.keyboard.container(this.#container);

    return this.#container;
  }
}


/** Defines generic treatments to input listeners (up, down) and can register triggers
 * 
 * All method names initializing with _ are for internal use of the class only
*/
class Grapper {
  #container = null;
  
  #up_listener;
  #down_listener;
  #registers = {'up':[],'down':[]};

  #prevent_keys = ["tab"];
  #key_mapping  = {
    'keyboard': {
      8  : "backspace",
      9  : "tab",
      13 : "enter",
      16 : "shift",
      17 : "control",
      18 : "alt",
      20 : "capslock",
      27 : "esc",
      32 : "space",
      37 : "left",
      38 : "up",
      39 : "right",
      40 : "down",
      144: "numlock",
      186: "ç"
    },
    'mouse': {
      0: "left",
      1: "scroll",
      2: "right"
    }
  };

  constructor(e, up_event, down_event){
    this.container(e);
    this._upEvent(up_event);
    this._downEvent(down_event);
  }

  /** Change element references, inflicts directly on mouse grapper coordinates
   * 
   * @param {HTMLElement} e
   * @returns {HTMLElement} Self container
   */
  container(e){
    this.#container = $(e)[0];

    return this.#container;
  }

  /** Register given function to run when trigger up event
   * 
   * @param {Function} func 
   */
  up(func){
    this.#registers.up.push(func);
  }

  /** Register given function to run when trigger down event
   * 
   * @param {Function} func 
   */
  down(func){
    this.#registers.down.push(func);
  }

  /** Remove all trigger of given event type
   * 
   * @param {String} type - ("up", "down")
   * @return {Number} Number of affected triggers
   */
  unbind(type){
    let deleted = this.#registers[type].splice(0);
    return deleted.length;
  }


  _upEvent(e=null){
    this.#up_listener = this._listenerUp.bind(this);
    window.addEventListener(e, this.#up_listener);
  }

  _downEvent(e=null){
    this.#down_listener = this._listenerdown.bind(this);
    window.addEventListener(e, this.#down_listener);
  }

  _prepareInput(e){
    let key, key_type, translation;

    if(e.constructor.name == "KeyboardEvent"){
      key      = e.which || e.keyCode;
      key_type = "keyboard";

      key = String.fromCharCode(key).toLowerCase();
      key = key.charCodeAt();
    }
    else{ // "MouseEvent"
      key      = e.button;
      key_type = "mouse";
    }

    let t_default = {'keyboard': String.fromCharCode(key), 'mouse': String(key)};
    translation   = key in this.#key_mapping[key_type]? this.#key_mapping[key_type][key]: t_default[key_type];

    return {
      'code'       : key,
      'type'       : key_type,
      'translation': translation,
      'time'       : parseFloat((e.timeStamp/1000).toFixed(3)),
      'coord'      : key_type == "mouse"? {'x': e.x - this.#container.offsetLeft, 'y': e.y - this.#container.offsetTop}: null
    };
  }

  _listenerUp(e){
    let key = this._prepareInput(e);
    if(this.#prevent_keys.includes(key.translation)) e.preventDefault();

    this.#registers.up.forEach(f => f(key));
  }

  _listenerdown(e){
    let key = this._prepareInput(e);
    if(this.#prevent_keys.includes(key.translation)) e.preventDefault();
 
    this.#registers.down.forEach(f => f(key));
  }
}