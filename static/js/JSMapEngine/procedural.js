class GridProcedure {
  static prop = {
    'perlin': {
      'smooth': 0.05,
      'round' : 0.1,
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
      'linear'  : GridProcedure.gradient
    };

    return gen[type](sizes);
  }

  static perlin(size){
    let map = GridProcedure._cleanMap(size);
    // Perlin Noise - https://gpfault.net/posts/perlin-noise.txt.html



    return map;
  }

  static cellular(size){
    let map = GridProcedure._cleanMap(size);
    // Cellular Automaton - https://www.raywenderlich.com/2425-procedural-level-generation-in-games-using-a-cellular-automaton-part-1

    

    return map;
  }

  static gradient(size){
    return new Array(size.x).fill().map((_,x) => new Array(size.y).fill().map((_,y) => x+y));
  }


  static _cleanMap(size){
    return new Array(size.x).fill().map(e => new Array(size.y).fill(0));
  }
}