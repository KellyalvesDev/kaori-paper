import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT7AxO98_Py0bWZ6uHDTA_9W4DRlXATLQ",
  authDomain: "kaori-paper.firebaseapp.com",
  projectId: "kaori-paper"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 CARREGAR NOVIDADES
async function carregarNovidades(){

  const grid = document.getElementById("gridHome");
  if(!grid) return;

  grid.innerHTML = "Carregando...";

  try{

    const snapshot = await getDocs(collection(db, "produtos"));

    let lista = [];

    snapshot.forEach(doc => {
      lista.push(doc.data());
    });

    // 🔥 ORDENAR
    lista.sort((a,b) => (b.criadoEm || 0) - (a.criadoEm || 0));

    // 🔥 PEGAR 3
    let novidades = lista.slice(0,3);

    grid.innerHTML = "";

    novidades.forEach((p, index) => {

      let imagens = (p.imagens && p.imagens.length > 0)
        ? p.imagens
        : ["https://dummyimage.com/300x300/eee/000"];

      grid.innerHTML += `
        <div class="card-novidade" onclick='abrirProduto(${JSON.stringify(p)})'>

          <img 
            src="${imagens[0]}" 
            class="img-novidade hover-img"
            data-index="${index}"
            loading="lazy"
          >

          <h3>${p.nome}</h3>
          <p class="preco">R$ ${p.preco}</p>

        </div>
      `;

      // salva imagens no elemento depois
      setTimeout(()=>{
        const img = document.querySelectorAll(".hover-img")[index];
        img.dataset.lista = JSON.stringify(imagens);
      },0);

    });

    ativarSlideshowHover();

  }catch(e){
    console.error(e);
    grid.innerHTML = "Erro ao carregar novidades ❌";
  }

}

// 🔥 SLIDESHOW HOVER
function ativarSlideshowHover(){

  const imgs = document.querySelectorAll(".hover-img");

  imgs.forEach(img => {

    let interval;

    img.addEventListener("mouseenter", () => {

      let lista = JSON.parse(img.dataset.lista || "[]");

      if(lista.length <= 1) return;

      let i = 0;

      interval = setInterval(() => {

        img.style.opacity = 0;

        setTimeout(()=>{
          img.src = lista[i];
          img.style.opacity = 1;
        },150);

        i++;
        if(i >= lista.length) i = 0;

      }, 1200); // 🔥 velocidade (pode ajustar)

    });

    img.addEventListener("mouseleave", () => {

      clearInterval(interval);

      let lista = JSON.parse(img.dataset.lista || "[]");

      if(lista.length > 0){
        img.src = lista[0]; // volta pra principal
      }

    });

  });

}

// 🔥 ABRIR PRODUTO
function abrirProduto(produto){
  localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
  window.location.href = "produto.html";
}

window.abrirProduto = abrirProduto;

// START
carregarNovidades();