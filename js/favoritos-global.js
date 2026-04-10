function abrirFav(){

let painel = document.getElementById("painelFav")

painel.classList.toggle("ativo")

renderFav()

}

function renderFav(){

let fav = JSON.parse(localStorage.getItem("fav")) || []

let lista = document.getElementById("listaFav")

lista.innerHTML=""

if(fav.length === 0){
lista.innerHTML="<p>Sem favoritos ainda</p>"
return
}

fav.forEach((p,i)=>{

lista.innerHTML += `
<div class="item-fav">

<img src="${p.imagens[0]}">

<div style="flex:1">
<p>${p.nome}</p>
<p>R$ ${p.preco.toFixed(2)}</p>
</div>

<button class="rem-fav" onclick="remFav(${i})">X</button>

</div>
`

})

}

function remFav(i){

let fav = JSON.parse(localStorage.getItem("fav")) || []

fav.splice(i,1)

localStorage.setItem("fav",JSON.stringify(fav))

renderFav()

}