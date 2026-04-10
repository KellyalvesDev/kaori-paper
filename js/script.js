fetch("data/produtos.json")
.then(r=>r.json())
.then(produtos=>{

let home = document.getElementById("homeProdutos")

produtos.slice(0,4).forEach(p=>{

home.innerHTML += `
<div class="produto">
<img src="${p.imagens[0]}" class="img-produto">
<h3>${p.nome}</h3>
<p>R$ ${p.preco.toFixed(2)}</p>
<a href="produtos.html" class="btn-loja">Comprar agora</a>
</div>
`

})

})