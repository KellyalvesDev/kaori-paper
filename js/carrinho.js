// ==========================
// ⚙️ CONFIG
// ==========================
const CHAVE_PIX = "62991008898"; // sua chave PIX

// ==========================
// 🛒 DADOS
// ==========================
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

let descontoCarrinho = 0;
let freteCarrinho = 0;
let prazoEntrega = "";

// ==========================
// 📦 RENDER CARRINHO
// ==========================
function render(){

  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("totalCarrinho");

  if(!lista) return;

  lista.innerHTML = "";

  let totalProdutos = 0;

  carrinho.forEach((p, index) => {

    let preco = Number(p.preco) || 0;
    let qtd = p.quantidade || 1;

    let subtotal = preco * qtd;
    totalProdutos += subtotal;

    let img = p.imagens?.[0] || "https://dummyimage.com/100x100/eee/000";

    lista.innerHTML += `
      <div class="item-carrinho">
        <img src="${img}">
        <div class="info-item">
          <strong>${p.nome}</strong><br>
          Qtd: ${qtd}<br>
          R$ ${preco.toFixed(2)}
        </div>

        <div>
          <strong>R$ ${subtotal.toFixed(2)}</strong><br>
          <button onclick="removerItem(${index})">❌</button>
        </div>
      </div>
    `;
  });

  let totalFinal = totalProdutos - descontoCarrinho + freteCarrinho;

  totalEl.innerHTML = `
    Produtos: R$ ${totalProdutos.toFixed(2)}<br>
    Desconto: -R$ ${descontoCarrinho.toFixed(2)}<br>
    Frete: R$ ${freteCarrinho.toFixed(2)}<br>
    <strong>Total: R$ ${totalFinal.toFixed(2)}</strong>
  `;
}

// ==========================
// ❌ REMOVER ITEM
// ==========================
function removerItem(index){
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  render();
}
window.removerItem = removerItem;

// ==========================
// 🎟 CUPOM
// ==========================
function aplicarCupom(){

  let cupom = document.getElementById("cupom").value.toUpperCase();

  let total = carrinho.reduce((acc, p) => acc + (p.preco * (p.quantidade || 1)), 0);

  if(cupom === "KAORI10"){
    descontoCarrinho = total * 0.10;
    alert("10% OFF aplicado 🎉");
  }
  else if(cupom === "BEMVINDO"){
    descontoCarrinho = total * 0.05;
    alert("5% OFF aplicado 🎉");
  }
  else{
    descontoCarrinho = 0;
    alert("Cupom inválido ❌");
  }

  render();
}
window.aplicarCupom = aplicarCupom;

// ==========================
// 🚚 FRETE + PRAZO
// ==========================
async function calcularFrete(){

  let cep = document.getElementById("cep").value;

  if(cep.length !== 8){
    alert("CEP inválido");
    return;
  }

  try{

    let res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    let data = await res.json();

    if(data.localidade === "Anápolis"){
      freteCarrinho = 10;
      prazoEntrega = "Entrega em até 24h 🚀";
    }
    else if(data.localidade === "Goiânia"){
      freteCarrinho = 15;
      prazoEntrega = "Entrega em 1 a 2 dias úteis 📦";
    }
    else{
      freteCarrinho = 25;
      prazoEntrega = "Entrega em 3 a 7 dias úteis 🚚";
    }

    let total = carrinho.reduce((acc, p) => acc + (p.preco * (p.quantidade || 1)), 0);

    if(total >= 150){
      freteCarrinho = 0;
      prazoEntrega = "Frete grátis 🚚";
    }

    document.getElementById("prazoEntrega").innerText = prazoEntrega;

    render();

  }catch(e){
    console.error(e);
    alert("Erro ao calcular frete");
  }
}
window.calcularFrete = calcularFrete;

// ==========================
// 💰 PIX (QR CODE + COPIAR)
// ==========================
document.getElementById("pagamento")?.addEventListener("change", function(){

  let pixBox = document.getElementById("pixBox");

  if(this.value === "Pix"){

    pixBox.style.display = "block";

    let qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX:${CHAVE_PIX}`;

    document.getElementById("qrPix").src = qr;

  }else{
    pixBox.style.display = "none";
  }

});

function copiarPix(){
  navigator.clipboard.writeText(CHAVE_PIX);
  alert("Chave Pix copiada ✅");
}
window.copiarPix = copiarPix;

// ==========================
// 📲 FINALIZAR PEDIDO
// ==========================
function finalizarPedido(){

  if(carrinho.length === 0){
    alert("Carrinho vazio 😢");
    return;
  }

  let nome = document.getElementById("nomeCliente").value;
  let endereco = document.getElementById("enderecoCliente").value;
  let cep = document.getElementById("cep").value;
  let pagamento = document.getElementById("pagamento").value;

  if(!nome || !endereco || !pagamento){
    alert("Preencha todos os dados 😢");
    return;
  }

  let mensagem = `🛍️ *Pedido - Kaori Paper*%0A%0A`;

  mensagem += `👤 Nome: ${nome}%0A`;
  mensagem += `📍 Endereço: ${endereco}%0A`;
  mensagem += `📮 CEP: ${cep}%0A`;
  mensagem += `💳 Pagamento: ${pagamento}%0A%0A`;

  // TROCO
  if(pagamento === "Dinheiro"){
    let troco = prompt("Troco para quanto?");
    if(troco){
      mensagem += `💵 Troco para: R$ ${troco}%0A%0A`;
    }
  }

  let total = 0;

  carrinho.forEach(p => {

    let subtotal = p.preco * (p.quantidade || 1);
    total += subtotal;

    mensagem += `• ${p.nome}%0A`;
    mensagem += `Qtd: ${p.quantidade}%0A`;
    mensagem += `R$ ${subtotal.toFixed(2)}%0A%0A`;
  });

  let totalFinal = total - descontoCarrinho + freteCarrinho;

  mensagem += `💰 Subtotal: R$ ${total.toFixed(2)}%0A`;
  mensagem += `🎟 Desconto: -R$ ${descontoCarrinho.toFixed(2)}%0A`;
  mensagem += `🚚 Frete: R$ ${freteCarrinho.toFixed(2)}%0A`;
  mensagem += `📦 Prazo: ${prazoEntrega}%0A%0A`;
  mensagem += `💵 *Total: R$ ${totalFinal.toFixed(2)}*`;

  let numero = "5562991008898";

  import { 
  getFirestore, 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

await addDoc(collection(db, "pedidos"), {
  nome,
  endereco,
  cep,
  pagamento,
  carrinho,
  desconto: descontoCarrinho,
  frete: freteCarrinho,
  total: totalFinal,
  status: "pendente",
  criadoEm: Date.now()
});

  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}
window.finalizarPedido = finalizarPedido;

// ==========================
// 🚀 START
// ==========================
render();