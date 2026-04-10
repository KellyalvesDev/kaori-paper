import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "kaori-paper.firebaseapp.com",
  projectId: "kaori-paper"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CLOUD_NAME = "drlwa6ghu";
const UPLOAD_PRESET = "kaori-unsigned";

let imagensFiles = [];
let produtoId = localStorage.getItem("produtoEditar");

// 🔥 CARREGAR PRODUTO
async function carregar(){

  let ref = doc(db, "produtos", produtoId);
  let snap = await getDoc(ref);

  let p = snap.data();

  document.getElementById("nome").value = p.nome;
  document.getElementById("preco").value = p.preco;
  document.getElementById("categoria").value = p.categoria;
  document.getElementById("descricao").value = p.descricao;

  let preview = document.getElementById("previewLista");

  p.imagens.forEach(url => {
    let img = document.createElement("img");
    img.src = url;
    img.style.width = "80px";
    preview.appendChild(img);
  });

}

carregar();

// 🔥 NOVAS IMAGENS
document.getElementById("imagem").addEventListener("change", e => {

  imagensFiles = Array.from(e.target.files);

});

// 🔥 ATUALIZAR
async function atualizar(){

  let nome = document.getElementById("nome").value;
  let preco = parseFloat(document.getElementById("preco").value);
  let categoria = document.getElementById("categoria").value;
  let descricao = document.getElementById("descricao").value;

  let imagens = [];

  // upload novas imagens
  for(let file of imagensFiles){

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    let res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{
      method:"POST",
      body: formData
    });

    let data = await res.json();

    if(data.secure_url){
      imagens.push(data.secure_url);
    }

  }

  let ref = doc(db, "produtos", produtoId);

  await updateDoc(ref, {
    nome,
    preco,
    categoria,
    descricao,
    ...(imagens.length > 0 && { imagens })
  });

  alert("Produto atualizado 🎉");

  window.location.href = "admin.html";
}

window.atualizar = atualizar;