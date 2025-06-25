document.addEventListener('DOMContentLoaded', function () {
    listarPedidos();

    document.querySelector('#voltar').addEventListener('click', function () {
        window.location.href = '/cliente/';
    });
});

function listarPedidos() {
    fetch('/cliente/pedidos/listar')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const pedidos = data.pedidos;
                const tabela = document.querySelector('#pedidosTabela tbody');

                if (pedidos.length === 0) {
                    tabela.innerHTML = '<tr><td colspan="4">Você ainda não fez nenhum pedido.</td></tr>';
                    return;
                }

                tabela.innerHTML = '';

                pedidos.forEach((pedido) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${pedido.nome_pedido || 'Sem nome'}</td>
                        <td>${pedido.status}</td>
                        <td>
                            ${
                                pedido.status === 'pendente' 
                                ? `<button class="btn-pagar" onclick="realizarPagamento(${pedido.id})">Pagar</button>
                                   <button class="btn-cancelar" onclick="cancelarPedido(${pedido.id})">Cancelar</button>`
                                : pedido.status === 'pago' || pedido.status === 'cancelado'
                                  ? `<button class="btn-apagar" onclick="apagarPedido(${pedido.id})">🗑️</button>`
                                  : ''
                            }
                        </td>
                        <td><button onclick="verProdutos(${pedido.id})">Ver Produtos</button></td>
                    `;
                    tabela.appendChild(tr);
                });
            } else {
                alert('Erro ao carregar pedidos.');
            }
        })
        .catch(error => {
            console.error('Erro ao listar pedidos:', error);
            alert('Erro inesperado ao listar pedidos.');
        });
}

function verProdutos(pedidoId) {
    fetch(`/cliente/pedidos/produtos/${pedidoId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const produtos = data.produtos;
                const listaProdutos = document.querySelector('#produtosLista');

                listaProdutos.innerHTML = '';

                produtos.forEach(produto => {
                    const produtoDiv = document.createElement('div');
                    produtoDiv.innerHTML = `
                        <p><strong>Nome:</strong> ${produto.nome}</p>
                        <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
                        <p><strong>Valor:</strong> R$ ${produto.valor.toFixed(2)}</p>
                        <hr>
                    `;
                    listaProdutos.appendChild(produtoDiv);
                });

                document.getElementById('produtoModal').style.display = 'block';
            } else {
                alert('Erro ao obter produtos.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            alert('Erro inesperado ao buscar produtos.');
        });
}

function fecharModal() {
    document.getElementById('produtoModal').style.display = 'none';
}


function realizarPagamento(pedidoId) {
    fetch(`/cliente/pedidos/pagar/${pedidoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pagamento realizado com sucesso!');
            listarPedidos();
        } else {
            alert('Erro ao realizar o pagamento: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro ao realizar pagamento:', error);
        alert('Erro inesperado. Tente novamente.');
    });
}

function cancelarPedido(pedidoId) {
    fetch(`/cliente/pedidos/cancelar/${pedidoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido cancelado com sucesso!');
            listarPedidos();
        } else {
            alert(`Erro ao cancelar o pedido: ${data.error}`);
        }
    })
    .catch(error => {
        console.error('Erro ao cancelar pedido:', error);
        alert('Erro inesperado ao cancelar o pedido.');
    });
}

function apagarPedido(pedidoId) {
    fetch(`/cliente/pedidos/apagar/${pedidoId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido apagado com sucesso!');
            listarPedidos();
        } else {
            alert(`Erro ao apagar o pedido: ${data.error}`);
        }
    })
    .catch(error => {
        console.error('Erro ao apagar pedido:', error);
        alert('Erro inesperado ao apagar o pedido.');
    });
}