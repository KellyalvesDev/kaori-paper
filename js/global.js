function atualizarContador(){

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

document.getElementById("cart-count").innerText = carrinho.length

}

atualizarContador()