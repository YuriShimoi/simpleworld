/** REQUIRED http://joeiddon.github.io/perlin/perlin.js */

/** Object who holds procedure methods to produce mapping
 * 
 * All method/attribute names initializing with _ are for internal use of the class only
 */
class GridProcedure {
  static prop = {
    'perlin': {
      'frequency': 5
    },
    'cellular': {
      'iterations'   : 50,
      'basis'        : 0,
      'variants'     : [1, 0.7, 0.3],
      'initial_drop' : 0.04,
      'dissemination': 3,
      'smooth'       : 3,
      'random_check' : 1 // if 0 is linear, else is random pick in percentual P (0 < P ≤ 1) amount
    }
  }
  
  /** Generates a mapping with choosen method
   * 
   * @param {String} type - 'perlin', 'cellular', 'gradient', 'static'
   * @param {Object} sizes - E.g. {x:<Number>, y:<Number>}
   * @returns {Object} Generated mapping
   */
  static generate(type, sizes){
    let gen = {
      'perlin'  : GridProcedure._perlin,
      'cellular': GridProcedure._cellular,
      'gradient': GridProcedure._gradient,
      'static'  : GridProcedure._random
    };

    return gen[type](sizes);
  }
  

  static _perlin(size){
    try{
      perlin.seed();
      // Perlin Noise - https://joeiddon.github.io/projects/javascript/perlin
      let frequency = GridProcedure.prop.perlin.frequency;
      return GridProcedure._fill_map((x,y) => perlin.get((x/((size.x-1)/frequency*2))-frequency,
                                                         (y/((size.y-1)/frequency*2))-frequency), size);
    }
    catch{
      console.error("Perlin dependance not found.\nPlease import from http://joeiddon.github.io/perlin/perlin.js");
      return GridProcedure._cleanMap(size);
    }
  }

  static _cellular(size){
    let map = GridProcedure._cleanMap(size, GridProcedure.prop.cellular.basis);
    // Cellular Automaton - https://www.raywenderlich.com/2425-procedural-level-generation-in-games-using-a-cellular-automaton-part-1
    let drops     = GridProcedure.prop.cellular.initial_drop * size.x * size.y;
    let iter      = GridProcedure.prop.cellular.iterations;
    let basis     = GridProcedure.prop.cellular.basis;
    let rnd_check = GridProcedure.prop.cellular.random_check;

    for(let v in GridProcedure.prop.cellular.variants){
      let variant = GridProcedure.prop.cellular.variants[v];
      for(let d=0; d < drops; d++){
        let x = Math.floor(Math.random() * size.x);
        let y = Math.floor(Math.random() * size.y);
        if(map[x][y] == basis) map[x][y] = variant;
      }
    }

    for(let i=0; i < iter; i++){
      for(let v in GridProcedure.prop.cellular.variants){
        let variant = GridProcedure.prop.cellular.variants[v];
        if(rnd_check != 0){
          let amount = rnd_check * size.x * size.y;
          for(let a=0; a < amount; a++){
            let x = Math.floor(Math.random() * size.x);
            let y = Math.floor(Math.random() * size.y);
  
            if(map[x][y] == basis || map[x][y] == variant){
              let is_dissm = GridProcedure._cellular_check(map, {'x':x, 'y':y}, variant);
              map[x][y]    = is_dissm? variant: basis;
            }
          }
        }
        else{
          for(let x in map){
            for(let y in map[x]){
              x = parseInt(x);
              y = parseInt(y);
  
              if(map[x][y] == basis || map[x][y] == variant){
                let is_dissm = GridProcedure._cellular_check(map, {'x':x, 'y':y}, variant);
                map[x][y]    = is_dissm? variant: basis;
              }
            }
          }
        }
      }
    }
    for(let s=0; s < GridProcedure.prop.cellular.smooth; s++){
      map = GridProcedure._cellular_smooth(map);
    }

    return map;
  }

  static drunken(size){
    let map = GridProcedure._cleanMap(size);
    // Drunken Walk - https://www.reddit.com/r/roguelikedev/comments/hhzszb/using_a_modified_drunkards_walk_to_generate_cave/
    //              - http://davideyork.com/drunken-walk-procedural-algorithm/
    

    return map;
  }

  static _gradient(size){
    return GridProcedure._fill_map((x,y) => x+y, size);
  }

  static _random(size){
    return GridProcedure._fill_map((x,y) => Math.random(), size);
  }

  static _cleanMap(size, empty_value=0){
    return new Array(size.x).fill().map(_ => new Array(size.y).fill(empty_value));
  }

  static _fill_map(method, size){
    return new Array(size.x).fill().map((_,x) => new Array(size.y).fill().map((_,y) => method(x,y)));
  }

  static _cellular_check(map, pos, v){
    let dissm = GridProcedure.prop.cellular.dissemination;
    let basis = GridProcedure.prop.cellular.basis;

    let occur   = 0;
    let var_qnt = 0;
    for(let x = pos.x-1; x <= pos.x+1; x++){
      if(x >= 0 && x < map.length){
        for(let y = pos.y-1; y <= pos.y+1; y++){
          if(y >= 0 && y < map[x].length){
            if(map[x][y] == basis)  occur++;
            else if(map[x][y] == v) var_qnt++;
          }
          else{
            occur++;
          }
        }
      }
      else{
        occur++;
      }
    }

    return occur <= 9-dissm && var_qnt >= dissm;
  }

  static _cellular_smooth(map){
    for(let x in map){
      for(let y in map[x]){
        x = parseInt(x);
        y = parseInt(y);
        let freq      = GridProcedure._cellular_area_frequency(map, {'x':x, 'y':y});
        let most      = '';
        let freq_most = 0;
        for(let f in freq){
          if(freq[f] > freq_most) {
            most = f;
            freq_most = freq[f];
          }
        }
        map[x][y] = most;
      }
    }

    return map;
  }

  static _cellular_area_frequency(map, pos){
    let types = [...GridProcedure.prop.cellular.variants, ...[GridProcedure.prop.cellular.basis]];
    let freq  = {};
    types.forEach(t => freq[t] = 0);

    for(let x = pos.x-1; x <= pos.x+1; x++){
      if(x >= 0 && x < map.length){
        for(let y = pos.y-1; y <= pos.y+1; y++){
          if(y >= 0 && y < map[x].length){
            freq[map[x][y]]++;
          }
        }
      }
    }

    return freq;
  }
}