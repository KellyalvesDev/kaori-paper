// =========================
// ❤️ FAVORITOS GLOBAL
// =========================

// pegar favoritos do localStorage
function getFav(){
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

// salvar favoritos
function setFav(lista){
  localStorage.setItem("favoritos", JSON.stringify(lista));
}

// adicionar/remover favorito
function favoritar(produto){

  let fav = getFav();

  let existe = fav.find(p => p.nome === produto.nome);

  if(existe){
    // remover
    fav = fav.filter(p => p.nome !== produto.nome);
    alert("Removido dos favoritos 💔");
  }else{
    // adicionar
    fav.push(produto);
    alert("Adicionado aos favoritos ❤️");
  }

  setFav(fav);
  renderFav();
}

// abrir/fechar painel
function abrirFav(){
  document.getElementById("painelFav").classList.add("ativo");
}

function fecharFav(){
  document.getElementById("painelFav").classList.remove("ativo");
}

// remover item
function removerFav(nome){
  let fav = getFav().filter(p => p.nome !== nome);
  setFav(fav);
  renderFav();
}

// renderizar lista
function renderFav(){

  let lista = document.getElementById("listaFav");
  if(!lista) return;

  let fav = getFav();

  lista.innerHTML = "";

  if(fav.length === 0){
    lista.innerHTML = "<p>Sem favoritos 😢</p>";
    return;
  }

  fav.forEach(p => {

    let img = p.imagens?.[0] || "https://dummyimage.com/100x100/eee/000";

    lista.innerHTML += `
      <div class="item-fav">

        <img src="${img}">

        <div style="flex:1">
          <strong>${p.nome}</strong><br>
          R$ ${p.preco}
        </div>

        <button class="rem-fav" onclick="removerFav('${p.nome}')">
          ✖
        </button>

      </div>
    `;
  });
}

// deixar global
window.favoritar = favoritar;
window.abrirFav = abrirFav;
window.fecharFav = fecharFav;
window.removerFav = removerFav;

// iniciar
renderFav();