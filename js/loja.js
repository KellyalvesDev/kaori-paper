import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT7AxO98_Py0bWZ6uHDTA_9W4DRlXATLQ",
  authDomain: "kaori-paper.firebaseapp.com",
  projectId: "kaori-paper"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let pagina = 1;
let porPagina = 8;
let listaProdutos = [];

async function carregarProdutos(){

  let grid = document.getElementById("gridProdutos");
  if(!grid) return;

  grid.innerHTML = "Carregando...";

  try{

    let snapshot = await getDocs(collection(db, "produtos"));

    listaProdutos = [];

    snapshot.forEach(doc => {
      listaProdutos.push(doc.data());
    });

    // 🔥 ORDEM CORRETA (NOVO PRIMEIRO)
    listaProdutos.sort((a,b) => (b.criadoEm || 0) - (a.criadoEm || 0));

    if(listaProdutos.length === 0){
      grid.innerHTML = "Nenhum produto cadastrado 😢";
      return;
    }

    renderizar();

  }catch(e){
    console.error(e);
    grid.innerHTML = "Erro ao carregar ❌";
  }
}

function renderizar(){

  let grid = document.getElementById("gridProdutos");

  let inicio = (pagina - 1) * porPagina;
  let fim = inicio + porPagina;

  let itens = listaProdutos.slice(inicio, fim);
  

  grid.innerHTML = "";

  itens.forEach(p => {

    let img = "https://dummyimage.com/300x300/eee/000";

    if(p.imagens && p.imagens.length > 0){
      img = p.imagens[0];
    }

    grid.innerHTML += `
<div class="produto">

  <button class="fav-btn" onclick='favoritar(${JSON.stringify(p)})'>❤</button>

  <div onclick='abrirProduto(${JSON.stringify(p)})'>
    <img src="${img}" class="img-produto" loading="lazy">
    <h3>${p.nome}</h3>
    <p class="preco">R$ ${p.preco}</p>
  </div>

</div>
`;
  });

  document.getElementById("numPagina").innerText = pagina;
}

function mudarPagina(valor){

  let total = Math.ceil(listaProdutos.length / porPagina);

  pagina += valor;

  if(pagina < 1) pagina = 1;
  if(pagina > total) pagina = total;

  renderizar();
}

window.mudarPagina = mudarPagina;

function abrirProduto(produto){
  localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
  window.location.href = "produto.html";
}

window.abrirProduto = abrirProduto;

carregarProdutos();

// =========================
// 🔎 FILTRO POR CATEGORIA
// =========================
function filtrar(categoria){

  if(categoria === "todos"){
    renderizarLista(listaProdutos);
    return;
  }

  let filtrados = listaProdutos.filter(p => 
    p.categoria && p.categoria.toLowerCase() === categoria.toLowerCase()
  );

  renderizarLista(filtrados);
}

window.filtrar = filtrar;


// =========================
// 🔎 BUSCA
// =========================
function buscar(texto){

  texto = texto.toLowerCase();

  let filtrados = listaProdutos.filter(p =>
    p.nome.toLowerCase().includes(texto)
  );

  renderizarLista(filtrados);
}

window.buscar = buscar;


// =========================
// 🔄 RENDER GENÉRICO
// =========================
function renderizarLista(lista){

  let grid = document.getElementById("gridProdutos");

  grid.innerHTML = "";

  lista.forEach(p => {

    let img = p.imagens?.[0] || "https://dummyimage.com/300x300/eee/000";

    grid.innerHTML += `
      <div class="produto">

        <button class="fav-btn" onclick='favoritar(${JSON.stringify(p)})'>❤</button>

        <div onclick='abrirProduto(${JSON.stringify(p)})'>
          <img src="${img}" class="img-produto" loading="lazy">
          <h3>${p.nome}</h3>
          <p class="preco">R$ ${p.preco}</p>
        </div>

      </div>
    `;
  });

}