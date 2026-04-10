import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT7AxO98_Py0bWZ6uHDTA_9W4DRlXATLQ",
  authDomain: "kaori-paper.firebaseapp.com",
  projectId: "kaori-paper"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// CLOUDINARY
const CLOUD_NAME = "drlwa6ghu";
const UPLOAD_PRESET = "kaori-unsigned";

// IMAGENS
let imagensFiles = [];

// =========================
// 📸 PREVIEW
// =========================
const inputImagem = document.getElementById("imagem");

if(inputImagem){
  inputImagem.addEventListener("change", e => {

    imagensFiles = Array.from(e.target.files);

    let preview = document.getElementById("previewLista");
    preview.innerHTML = "";

    imagensFiles.forEach(file => {
      let img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.width = "70px";
      img.style.height = "70px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "10px";
      img.style.margin = "5px";
      preview.appendChild(img);
    });

  });
}

// =========================
// 💾 SALVAR
// =========================
async function salvar(){

  let nome = document.getElementById("nome").value;
  let preco = parseFloat(document.getElementById("preco").value);
  let categoria = document.getElementById("categoria").value;
  let descricao = document.getElementById("descricao").value;

  if(!nome || !preco){
    alert("Preencha nome e preço");
    return;
  }

  let imagensUrls = [];

  try{

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
        imagensUrls.push(data.secure_url);
      }
    }

    if(imagensUrls.length === 0){
      imagensUrls.push("https://dummyimage.com/300x300/eee/000");
    }

    await addDoc(collection(db, "produtos"), {
      nome,
      preco,
      categoria,
      descricao,
      imagens: imagensUrls,
      criadoEm: Date.now()
    });

    alert("Produto salvo 🎉");

    // limpar
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("previewLista").innerHTML = "";
    imagensFiles = [];

    carregarProdutos();

  }catch(e){
    console.error(e);
    alert("Erro ao salvar ❌");
  }
}

window.salvar = salvar;

// =========================
// 📋 LISTAR
// =========================
async function carregarProdutos(){

  let lista = document.getElementById("listaAdmin");
  if(!lista) return;

  lista.innerHTML = "Carregando...";

  try{

    let snapshot = await getDocs(collection(db, "produtos"));

    lista.innerHTML = "";

    snapshot.forEach(docSnap => {

      let p = docSnap.data();

      let img = (p.imagens && p.imagens[0]) 
        ? p.imagens[0] 
        : "https://dummyimage.com/100x100/eee/000";

      lista.innerHTML += `
        <div style="display:flex;align-items:center;gap:10px;margin:10px 0;background:#fff;padding:10px;border-radius:10px;">
          
          <img src="${img}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
          
          <div style="flex:1">
            <strong>${p.nome}</strong><br>
            R$ ${p.preco}
          </div>

          <button onclick="editarProduto('${docSnap.id}')"
          style="background:#4CAF50;color:white;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;">
          Editar
          </button>

          <button onclick="excluirProduto('${docSnap.id}')" 
          style="background:#ff6b9d;color:white;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;">
          Excluir
          </button>

        </div>
      `;
    });

    if(snapshot.empty){
      lista.innerHTML = "Nenhum produto cadastrado 😢";
    }

  }catch(e){
    console.error(e);
    lista.innerHTML = "Erro ao carregar ❌";
  }
}

// =========================
// 🗑 EXCLUIR
// =========================
async function excluirProduto(id){

  if(!confirm("Deseja excluir este produto?")) return;

  try{
    await deleteDoc(doc(db, "produtos", id));
    alert("Excluído!");
    carregarProdutos();
  }catch(e){
    console.error(e);
    alert("Erro ao excluir ❌");
  }
}

window.excluirProduto = excluirProduto;

// =========================
// ✏️ EDITAR (REDIRECIONA)
// =========================
function editarProduto(id){
  localStorage.setItem("produtoEditar", id);
  window.location.href = "editar.html";
}

window.editarProduto = editarProduto;

// START
carregarProdutos();