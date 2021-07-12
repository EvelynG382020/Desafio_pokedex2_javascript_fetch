$(document).ready(function () {
  //llamado de listado de pokemones
  getPokemon("https://pokeapi.co/api/v2/pokemon");
});

//FUNCTIONS

//extraemos cada pokemon y asignamos url de los proximos 20 pokemones
function getPokemon(url) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.results.forEach(function (pokemon) {
        getImage(pokemon);
        //addPokemon(pokemon)
      });
      $("#more-pokemons").attr("data-next", data.next);
    });
}
// mostramos el nombre  de cada pokemon y el btn de ver mas
function addPokemon(pokemon, image) {
  $("#pokedex").append(
    '<div class="card col-xs-12 col-sm-3 m-3" >' +
      '<img src="' +
      image +
      '" class="card-img-top" alt="..."></img>' +
      '<div class="card-body">' +
      '<h5 class="card-title text-center">' +
      pokemon.name +
      "</h5>" +
      '<button class="btn btn-info btn-pok" data-bs-toggle="modal" data-bs-target="#pokemon-data"  data-pokemon=' +
      pokemon.name +
      "> Quiero saber mas de este pokemon" +
      "</button>" +
      " </div>" +
      "</div>"
  );
}

function getImage(pokemon) {
  let url_pokemon = "https://pokeapi.co/api/v2/pokemon/" + pokemon.name;
  fetch(url_pokemon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      image = data.sprites.front_default;
      addPokemon(pokemon, image);
    });
  //no existe image
}

// traemos la info de cada pokemon al click
function getPokemonData(pokemon) {
  let url_pok = "https://pokeapi.co/api/v2/pokemon/";
  fetch(url_pok + pokemon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#pokemon-data-name").text(data.name);
      $("#pokemon-image").append(
        '<img src="' +
          data.sprites.front_shiny +
          '" class="card-img-top" alt="..."></img>'
      );
      data.types.forEach(function (tipo) {
        $("#pokemon-types").append("<li>" + tipo.type.name + "</li>");
        $("#pokemon-types").append(
          '<button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#damage-data"  data-type=' +
            tipo.type.name +
            "> Ver relaciones de daño" +
            "</button>"
        );
        getPokemonGeneration(tipo.type.url);
      });

      data.abilities.forEach(function (habilidad) {
        $("#pokemon-abilities").append(
          "<li>" + habilidad.ability.name + "</li>"
        );
        $("#pokemon-abilities").append(
          '<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#others-pokemon-ability"  data-ability=' +
            habilidad.ability.name +
            "> Otros pokemones con esta habilidad" +
            "</button>"
        );
      });

      let count = 0;
      data.moves.forEach(function (move) {
        count++;
        if (count < 6) {
          $("#pokemon-moves").append("<li>" + move.move.name + "</li>");
        }
      });
    });

  vaciarContenido();
}

function vaciarContenido() {
  $("#pokemon-image").empty();
  $("#pokemon-moves").empty();
  $("#pokemon-data-name").empty();
  $("#pokemon-types").empty();
  $("#pokemon-generations").empty();
  $("#pokemon-abilities").empty();
}

function getPokemonGeneration(url) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#pokemon-generations").append("<li>" + data.generation.name + "</li>");
    });
}

function damageData(type) {
  let url_damage = "https://pokeapi.co/api/v2/type/" + type;
  fetch(url_damage)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#type-name").text(data.name);

      data.damage_relations.double_damage_from.forEach(function (damage) {
        $("#double-damage-from").append("<li>" + damage.name + "</li>");
      });

      data.damage_relations.double_damage_to.forEach(function (damage) {
        $("#double-damage-to").append("<li>" + damage.name + "</li>");
      });

      data.damage_relations.half_damage_from.forEach(function (damage) {
        $("#half-damage-from").append("<li>" + damage.name + "</li>");
      });

      data.damage_relations.half_damage_to.forEach(function (damage) {
        $("#half-damage-to").append("<li>" + damage.name + "</li>");
      });

      data.damage_relations.no_damage_from.forEach(function (damage) {
        $("#no-damage-from").append("<li>" + damage.name + "</li>");
      });

      data.damage_relations.no_damage_to.forEach(function (damage) {
        $("#no-damage-to").append("<li>" + damage.name + "</li>");
      });
    });
  $("#type-name").empty();
  $("#double-damage-from").empty();
  $("#double-damage-to").empty();
  $("#half-damage-from").empty();
  $("#half-damage-to").empty();
  $("#no-damage-from").empty();
  $("#no-damage-to").empty();
}

function pokemonsWithAbilities(ability) {
  let url_ability = "https://pokeapi.co/api/v2/ability/" + ability;
  fetch(url_ability)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#ability-name").text(data.name);
      data.pokemon.forEach(function (pok) {
        $("#ability-pokemons-list").append("<li>" + pok.pokemon.name + "</li>");
      });
    });

  $("#ability-name").empty();
  $("#ability-pokemons-list").empty();
}

// EVENT LISTENERS

//recibimos el click para traer los proximos 20 pokemones
$("#more-pokemons").click(function () {
  getPokemon(this.dataset.next);
});

//recibimos el click del div general para identificar el pokemon target
$("#pokedex").click(function (event) {
  if (event.target.dataset.pokemon) {
    getPokemonData(event.target.dataset.pokemon);
  }
});

//recibimos el click del ol de tips para identificar el typo target
$("#pokemon-types").click(function (event) {
  if (event.target.dataset.type) {
    damageData(event.target.dataset.type);
  }
});

//recibimos el click del ol de habilidades para identificar el ability target
$("#pokemon-abilities").click(function (event) {
  if (event.target.dataset.ability) {
    pokemonsWithAbilities(event.target.dataset.ability);
  }
});

// 1. traer los datos preliminares de los 20 pokemones para mostrarlos en cards con su boton del modal.  - DONE
// 2. darle funcionamiento al btn que trae los 20 poks siguientes. - DONE
// 3. crear modal con sus ids para mostrar la info de cada pokemon - DONE
// 4. crear la funcion que traiga esa info por cada pokemon   -DONE
//mostrar titulo de pokemon en el modal - DONE
// mostrar tipo, habilidades, generaciones, movimientos por cada pokemon -DONE
// 5. reemplazamos los Ajax por fetch API - DONE
// 6. crear los nuevos modales para habilidades y relaciones de daño -- DONE
// 7. implementamos las relaciones de daño -DONE
// 8. implementamos las habilidades -DONE
