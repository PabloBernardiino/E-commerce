function listarProdutos() {
    fetch('/produtos/listar', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                console.error('Erro na resposta da requisição:', response.statusText);
                return Promise.reject('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.produtos) {
                const tbody = document.querySelector('#produtosTabela tbody');
                tbody.innerHTML = '';

                data.produtos.forEach(produto => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${produto.nome}</td>
                        <td>${produto.valor}</td>
                        <td>${produto.descricao}</td>
                        <td><input type="number" class="quantidadeInput" value="1" min="1" data-produto-id="${produto.id}"></td>
                        <td>
                            <button class="btn-add" 
                                    onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', '${produto.valor}')">
                                Adicionar ao Carrinho
                            </button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                console.error('Erro ao carregar produtos:', data.error);
            }
        })
        .catch(error => console.error('Erro ao listar produtos:', error));
}

function adicionarAoCarrinho(produtoId, nome, valor) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const quantidadeInput = document.querySelector(`input[data-produto-id="${produtoId}"]`);
    const quantidade = parseInt(quantidadeInput.value);

    if (quantidade < 1) {
        alert('A quantidade mínima é 1');
        return;
    }
    const produto = {
        id: produtoId,
        nome: nome,
        valor: parseFloat(valor),
        quantidade: quantidade
    };

    const produtoExistente = carrinho.find(item => item.id === produto.id);
    if (produtoExistente) {
        produtoExistente.quantidade += produto.quantidade;
    } else {
        carrinho.push(produto);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert('Produto adicionado ao carrinho com sucesso!');
}

document.getElementById('logoutBtn').addEventListener('click', function () {

    sessionStorage.clear();
    window.location.href = '/usuarios/';
});

document.getElementById('CarrinhoBtn').addEventListener('click', function () {

    window.location.href='/cliente/carrinho';
});

document.getElementById('PedidosBtn').addEventListener('click', function () {

    window.location.href='/cliente/pedidos';
});

document.addEventListener('DOMContentLoaded', listarProdutos);