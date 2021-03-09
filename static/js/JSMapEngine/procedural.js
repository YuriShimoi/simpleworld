/** REQUIRED http://joeiddon.github.io/perlin/perlin.js */

/** 
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class GridProcedure {
  static _fill_map = (method, size) => new Array(size.x).fill().map((_,x) => new Array(size.y).fill().map((_,y) => method(x,y)));

  static prop = {
    'perlin': {
      'smooth': 0.05,
      'basis' : 0.5,
      'max'   : 1,
      'min'   : 0
    },
    'cellular': {
      'iterations'  : 10,
      'variants'    : [0, 1],
      'random_check': 0 // if 0 is linear, else is percentage 0 < p ≤ 1
    }
  }
  
  static generate(type, sizes){
    let gen = {
      'perlin'  : GridProcedure.perlin,
      'cellular': GridProcedure.cellular,
      'gradient': GridProcedure.gradient,
      'random'  : GridProcedure.random
    };

    return gen[type](sizes);
  }

  static perlin(size){
    let map = GridProcedure._cleanMap(size);
    // Perlin Noise - https://joeiddon.github.io/projects/javascript/perlin
    return GridProcedure._fill_map((x,y) => perlin.get(x/size.x, y/size.y), size);
  }

  static cellular(size){
    let map = GridProcedure._cleanMap(size);
    // Cellular Automaton - https://www.raywenderlich.com/2425-procedural-level-generation-in-games-using-a-cellular-automaton-part-1

    

    return map;
  }

  static gradient(size){
    return GridProcedure._fill_map((x,y) => x+y, size);
  }

  static random(size){
    return GridProcedure._fill_map((x,y) => Math.random(), size);
  }


  static _cleanMap(size){
    return new Array(size.x).fill().map(e => new Array(size.y).fill(0));
  }
}