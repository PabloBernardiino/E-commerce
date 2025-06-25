listarCarrinho();

function listarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const tabela = document.querySelector('#carrinhoTabela tbody');
    const totalCarrinhoSpan = document.querySelector('#totalCarrinho');

    if (carrinho.length === 0) {
        tabela.innerHTML = '<tr><td colspan="5">Seu carrinho está vazio.</td></tr>';
        totalCarrinhoSpan.textContent = '0.00';
        return;
    }

    tabela.innerHTML = '';
    let totalCarrinho = 0;

    carrinho.forEach((produto, index) => {
        const valorProduto = produto.valor ? parseFloat(produto.valor) : 0;
        const valorTotal = valorProduto * produto.quantidade;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>${valorProduto.toFixed(2)}</td>
            <td><input type="number" class="quantidadeInput" value="${produto.quantidade}" min="1" data-index="${index}"></td>
            <td>${valorTotal.toFixed(2)}</td>
            <td><button class="btn-remove" onclick="removerProduto(${index})">Remover</button></td>
        `;
        tabela.appendChild(tr);
        totalCarrinho += valorTotal;
    });

    totalCarrinhoSpan.textContent = totalCarrinho.toFixed(2);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    document.querySelectorAll('.quantidadeInput').forEach(input => {
        input.addEventListener('change', function () {
            const index = parseInt(this.getAttribute('data-index'));
            atualizarQuantidade(index, parseInt(this.value));
        });
    });
}

function atualizarQuantidade(index, novaQuantidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (novaQuantidade < 1) {
        alert('A quantidade mínima é 1');
        novaQuantidade = 1;
    }
    carrinho[index].quantidade = novaQuantidade;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    listarCarrinho();
}

function removerProduto(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    listarCarrinho();
}

function realizarPedido() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let nomePedido = document.getElementById('nomePedido').value.trim();

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (nomePedido === "") {
        alert("Por favor, adicione um nome ao pedido.");
        return;
    }

    let produtos = carrinho.map(item => ({
        id: item.id,
        quantidade: item.quantidade
    }));

    fetch('/cliente/realizar_pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            produtos: produtos,
            nomePedido: nomePedido
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || 'Erro ao processar o pedido.'); });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Pedido realizado com sucesso!");
            localStorage.removeItem('carrinho');
            window.location.href = '/cliente/pedidos';
        } else {
            alert(data.error || "Erro ao realizar o pedido. Tente novamente.");
        }
    })
    .catch(error => {
        console.error('Erro ao realizar o pedido:', error);
        alert(error.message || "Erro inesperado. Tente novamente.");
    });
}


document.getElementById('voltarbtn').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = '/cliente/';
});