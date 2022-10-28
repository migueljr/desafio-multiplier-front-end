<template>
  <div class="home header d-flex flex-column justify-content-center align-items-center py-4 w-100">
    <img alt="Vue logo" class="img-fluid logo" src="../assets/pokeapi.png">
    <h5 class="text-white font-weight-bold">Gerencie sua Pokédex</h5>
  </div>

  <div class="w-100 d-flex justify-content-center">

    <div class="d-flex justify-content-between px-4 py-4 tab-component w-100">
      <div @click="menuActive='list'" :class="{'active-tab-custom':menuActive=='list'}" class="tab-custom py-2 w-100 d-flex justify-content-center">
        <span :class="{'text-primary':menuActive=='list'}" class="font-weight-bold">Lista de pokémons</span>
      </div>
      <div @click="menuActive='pokedex'" :class="{'active-tab-custom':menuActive=='pokedex'}"  class="tab-custom py-2 w-100 d-flex justify-content-center">
        <span :class="{'text-primary':menuActive=='pokedex'}" class="font-weight-bold">Sua pokédex</span>
      </div>
    </div>

  </div>

  <div class="container">
    <div class="input-group flex-nowrap input-group-lg">
      <span class="input-group-text" id="addon-wrapping">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" style="width:20px;" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </span>
      <input v-model="search" type="text" class="form-control" placeholder="Procure aqui por nome" aria-label="Username" aria-describedby="addon-wrapping">
    </div>    
  </div>

  <div v-loading="loadList" class="container py-3">
    <div class="row">
      <div v-for="(item, index) in pokemonListFiltered.slice(0,limit)" :key="index" @click="getPokemon(item.name)" class="col-6 col-sm-4 col-md-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <div class="box w-full d-flex flex-column justify-content-center align-items-center" style="gap:5px;">
            <el-avatar v-if="menuActive=='list'" style="text-transform: uppercase;"> {{item.name[0]}}{{item.name[1]}} </el-avatar>
            <el-avatar v-else style="text-transform: uppercase;" :src="item.sprites.other['official-artwork'].front_default"></el-avatar>
            <span class="font-weight-bold" style="text-transform: capitalize;">{{item.name}}</span>
        </div>
      </div>
    </div>

    <p v-if="pokemonListFiltered.length==0" class="text-center mt-3">Sem resultados</p>
  </div>

  <div v-if="pokemonListFiltered.length>=limit" class="d-flex justify-content-center py-3">
    <span @click.prevent="limit = limit + 20;" href="" style="cursor:pointer;">
      Ver mais
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill-rule="evenodd" d="M5.22 8.72a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00-1.06-1.06L12 14.44 6.28 8.72a.75.75 0 00-1.06 0z"></path></svg>
    </span>
  </div>


  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="load" v-if="pokemonSelected.name" class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Detalhes de {{pokemonSelected.name}}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="w-100 d-flex flex-column align-items-center" style="gap:5px;">
            
            <div class="d-flex align-items-center justify-content-between  w-100" style="gap:10px;">
              
              <img class="img-modal border p-2" style="box-shadow: 4px 4px 4px rgb(0 0 0 / 3%);" :src="pokemonSelected.sprites.other['official-artwork'].front_default"  />
              
              <button @click="add(pokemonSelected)" :class="pokedex.filter(it=>it.name==pokemonSelected.name).length?'btn-danger':'btn-primary'" class="btn btn-sm" style="height: 34px;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width:20px;margin-right:5px;" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{pokedex.filter(it=>it.name==pokemonSelected.name).length ? 'Remover da pokedex' : 'Adicionar à pokedex'}}
              </button>

            </div>

            <div class="w-100 d-flex flex-column py-2" style="gap:10px;">
              <div class="d-flex justify-content-between">
                <div class="d-flex flex-column w-100">
                  <b>Nome</b>
                  <span>{{pokemonSelected.name}}</span>
                </div>
                <div class="d-flex flex-column w-100">
                  <b>Peso</b>
                  <span>{{pokemonSelected.weight}}</span>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <div class="d-flex flex-column w-100">
                  <b>Tamanho</b>
                  <span>{{pokemonSelected.height}}</span>
                </div>
                <div class="d-flex flex-column w-100">
                  <b>Lista de tipos</b>
                  <span>{{pokemonSelected.types.map(it=>it.type.name).join(', ')}}</span>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <div class="d-flex flex-column w-100">
                  <b>Habilidades</b>
                  <span>{{pokemonSelected.abilities.map(it=>it.ability.name).join(', ')}}</span>
                </div>
                <div class="d-flex flex-column w-100">
                  <b>Velocidade</b>
                  <span>{{pokemonSelected.stats.filter(it=>it.stat.name=='speed')[0].base_stat}}</span>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <div class="d-flex flex-column w-100">
                  <b>Defesa</b>
                  <span>{{pokemonSelected.stats.filter(it=>it.stat.name=='defense')[0].base_stat}}</span>
                </div>
                <div class="d-flex flex-column w-100">
                  <b>Ataque</b>
                  <span>{{pokemonSelected.stats.filter(it=>it.stat.name=='attack')[0].base_stat}}</span>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <div class="d-flex flex-column w-100">
                  <b>Hp</b>
                  <span>{{pokemonSelected.stats.filter(it=>it.stat.name=='hp')[0].base_stat}}</span>
                </div>
                <div class="d-flex flex-column w-100">
                  <b>Evolução</b>
                  <span>loren</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style>

  .box{
    background: #fff;
    height:115px;
    border-radius: 5px;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.03);
    margin-top:20px;
  }

  .box:hover{
    background-color: #eeeeee45;
    cursor:pointer;
  }

  body{
    background:#FBFBFB !important;
  }

  .header{
    background-color: #FDAE2B;
    border-radius: 0px 0px 50px 50px;
    gap:10px;
    box-shadow: 4px 4px 4px rgb(0 0 0 / 16%);
  }

  .logo{
    width:150px;
  }

  .tab-component{
    max-width: 400px;
  }

  .font-weight-bold{
    font-weight: 600;
  }

  .tab-custom{
    cursor:pointer;
  }

  .active-tab-custom{
    border-bottom:3px solid var(--bs-blue);
  }

  .img-modal{
    border-radius: 100%;
    object-fit: cover;
    width: 100px;
    height: 100px;
  }

</style>

<script>
import { usePokedexStore } from '@/stores/usePokedex'

export default {
  name: 'HomeView',
  data(){
    return{
      pokemonList:[],
      pokemonSelected:{},
      loadList:false,
      load:false,
      limit:20,
      search:'',
      
      pokedex:usePokedexStore().list,

      menuActive:'list'
    }
  },
  watch:{
    menuActive(){
      this.search = ''
    }
  },
  methods:{
    add(item){
      usePokedexStore().add(item)
    },
    async getPokemon(name){
      this.load = true
      try{

        const result = await fetch('https://pokeapi.co/api/v2/pokemon/'+name)
        const resultList = await result.json()
        this.pokemonSelected = resultList
      }catch(error){
        console.log(error.response)
      }

      this.load = false

    },
    async getListPokemons(){
      try{

        const result = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=2000')
        const resultList = await result.json()
        this.pokemonList = resultList.results
      }catch(error){
        console.log(error.response)
      }

      this.loadList = false
    }
  },
  computed:{
    pokemonListFiltered(){
      if(this.menuActive=='list'){
        return this.pokemonList.filter(it=>it.name.indexOf(this.search)!= -1)
      }else{
        return this.pokedex.filter(it=>it.name.indexOf(this.search)!= -1)
      }
      
    },
  },
  mounted(){
    this.loadList = true
    this.getListPokemons()
  }
}
</script>
