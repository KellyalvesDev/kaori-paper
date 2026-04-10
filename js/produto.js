// ==========================
// 📦 PRODUTO SELECIONADO
// ==========================
let p = JSON.parse(localStorage.getItem("produtoSelecionado"));

if(!p){
  alert("Produto não encontrado ❌");
}

// 🔥 LOCAL DA SUA SEDE (Anápolis)
const ORIGEM = {
  lat: -16.3556,
  lon: -48.9494
};

// 🔥 VARIÁVEIS GLOBAIS
let descontoAplicado = 0;
let freteAplicado = 0;

// ==========================
// 📦 CARREGAR PRODUTO
// ==========================
if(p){

  document.getElementById("nomeProduto").innerText = p.nome;
  document.getElementById("descricaoProduto").innerText = p.descricao || "";

  atualizarPreco();

  // 🔥 IMAGEM PRINCIPAL
  const imgPrincipal = document.getElementById("imgProduto");

  if(imgPrincipal){
    imgPrincipal.src = (p.imagens && p.imagens[0]) 
      ? p.imagens[0] 
      : "https://dummyimage.com/400x400/eee/000";
    imgPrincipal.setAttribute("fetchpriority", "high");
  }

  // 🔥 MINIATURAS
  let mini = document.getElementById("miniaturas");

  if(mini){
    mini.innerHTML = "";

    (p.imagens || []).forEach(img => {

      let el = document.createElement("img");
      el.src = img;
      el.loading = "lazy";
      el.onclick = () => {
        imgPrincipal.src = img;
      };

      mini.appendChild(el);
    });
  }

}

// ==========================
// 💰 ATUALIZAR PREÇO
// ==========================
function atualizarPreco(){

  if(!p) return;

  let precoBase = p.preco || 0;
  let precoComDesconto = precoBase - descontoAplicado;

  let total = precoComDesconto + freteAplicado;

  let texto = `R$ ${precoComDesconto.toFixed(2)}`;

  if(descontoAplicado > 0){
    texto += " (com desconto 🎉)";
  }

  if(freteAplicado > 0){
    texto += ` + Frete R$ ${freteAplicado.toFixed(2)}`;
  }

  document.getElementById("precoProduto").innerText = texto;
}

// ==========================
// 🎟 CUPOM
// ==========================
function aplicarCupomProduto(){

  let cupom = document.getElementById("cupomProduto").value.toUpperCase();
  let box = document.getElementById("infoCupom");

  if(!p) return;

  let preco = p.preco;
  let percentual = 0;

  if(cupom === "KAORI10"){
    percentual = 10;
  }
  else if(cupom === "BEMVINDO"){
    percentual = 5;
  }
  else{
    box.style.display = "block";
    box.innerHTML = "❌ Cupom inválido";
    return;
  }

  descontoAplicado = preco * (percentual / 100);

  let precoFinal = preco - descontoAplicado;

  box.style.display = "block";
  box.innerHTML = `
    🎉 <strong>${percentual}% OFF aplicado!</strong><br>
    Você economiza: R$ ${descontoAplicado.toFixed(2)}<br>
    <strong>Preço final: R$ ${precoFinal.toFixed(2)}</strong>
  `;

  atualizarPreco();
}

// ==========================
// 🚚 FRETE
// ==========================
async function calcularFreteProduto(){

  let cep = document.getElementById("cepProduto").value;
  let pFrete = document.getElementById("valorFreteProduto");

  if(cep.length !== 8){
    alert("Digite um CEP válido");
    return;
  }

  try{

    let res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    let data = await res.json();

    let frete = 0;

    // 🏙️ ANÁPOLIS (DISTÂNCIA)
    if(data.localidade === "Anápolis"){

      let destino = {lat:-16.34, lon:-48.95};

      let distancia = calcularDistancia(
        ORIGEM.lat,
        ORIGEM.lon,
        destino.lat,
        destino.lon
      );

      frete = 5 + (distancia * 2);
    }

    // 🏙️ GOIÂNIA
    else if(data.localidade === "Goiânia"){
      frete = 15;
    }

    // 🌎 OUTROS
    else{
      frete = 25;
    }

    // 🎁 FRETE GRÁTIS
    let precoAtual = p.preco - descontoAplicado;

    if(precoAtual >= 150){
      frete = 0;

      pFrete.innerHTML = `
        🎉 <strong style="color:green;">Frete GRÁTIS!</strong><br>
        📦 Entrega em ${data.localidade}
      `;
    }else{
      pFrete.innerHTML = `
        🚚 Frete: <strong>R$ ${frete.toFixed(2)}</strong><br>
        📍 ${data.localidade}
      `;
    }

    freteAplicado = frete;

    atualizarPreco();

  }catch(e){
    console.error(e);
    alert("Erro ao calcular frete ❌");
  }
}

// ==========================
// 🛒 CARRINHO
// ==========================
function addCarrinhoProduto(){

  if(!p) return;

  let qtd = parseInt(document.getElementById("quantidade").value) || 1;

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  carrinho.push({
    nome: p.nome,
    preco: p.preco,
    imagens: p.imagens || [],
    quantidade: qtd,
    desconto: descontoAplicado,
    frete: freteAplicado
  });

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  alert("Produto adicionado ao carrinho 🛒");
}

// ==========================
// 📏 DISTÂNCIA
// ==========================
function calcularDistancia(lat1, lon1, lat2, lon2){

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// ==========================
// 🌍 GLOBAL
// ==========================
window.aplicarCupomProduto = aplicarCupomProduto;
window.calcularFreteProduto = calcularFreteProduto;
window.addCarrinhoProduto = addCarrinhoProduto;