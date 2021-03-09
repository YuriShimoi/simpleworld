/** Engine core for JSMapEnine
 * 
 * All method names initializing with _ are for internal use of the class only
 */
class Engine {
  static _version        = "1.0.0";
  static _jquery_version = "3.6.0";
  static _folder_name    = "JSMapEngine";
  static _packages       = ["inputgrapper.js","display.js","display.css"];
  static _file_path      = null;

  constructor(){
    let has_jquery = this._checkFromJQuery(true);
    if(has_jquery){
      Engine._packages.forEach(p => Engine.import(p));
    }
    else{
      console.error("Engine could'n initialize, fix JQuery import.");
    }
  }
  
  
  /** Import given package
   * 
   * @param {String} src - See examples on Engine._packages default imports
   */
  static import(src){
    if(!Engine._file_path) Engine._findFilePath();

    let extension = src.split('.').slice(-1)[0];
    switch(extension){
      case 'js':
        document.writeln(`<script src="${this._file_path + src}"></script>`);
        break;
      case 'css':
        document.writeln(`<link rel="stylesheet" href="${this._file_path + src}">`);
        break;
    }
  }


  _checkFromJQuery(check_version=false){
    let has_jquery = Boolean(window.jQuery);

    if(has_jquery){
      if(check_version && window.jQuery.prototype.jquery != Engine._jquery_version){
        has_jquery = false;
        console.warn(`JQuery found on version ${window.jQuery.prototype.jquery}.\nRequired on version (${Engine._jquery_version}).`);
      }
    }
    else{
      console.warn(`JQuery not found.${check_version? "\nRequired on version ("+Engine._jquery_version+").":""}`);
    }

    return has_jquery;
  }

  static _findFilePath(){
    Engine._file_path = $(`script[src*="${Engine._folder_name}"]`).attr("src").split('/').slice(0,-1).join('/') + '/';
  }
}