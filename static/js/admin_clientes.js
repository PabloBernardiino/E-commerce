document.addEventListener('DOMContentLoaded', function() {
    fetch('/admin/clientes/listar')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const clientesTableBody = document.querySelector('#clientesTable tbody');
                clientesTableBody.innerHTML = '';

                data.clientes.forEach(cliente => {
                    const tr = document.createElement('tr');

                    const tdNome = document.createElement('td');
                    tdNome.textContent = cliente.nome;
                    tr.appendChild(tdNome);

                    const tdQuantidade = document.createElement('td');
                    tdQuantidade.textContent = cliente.historico_pedidos.length;
                    tr.appendChild(tdQuantidade);

                    const tdAcoes = document.createElement('td');
                    const btnDetalhes = document.createElement('button');
                    btnDetalhes.textContent = 'Detalhes';
                    btnDetalhes.classList.add('btn-detalhes');
                    btnDetalhes.addEventListener('click', () => {
                        const clienteId = cliente.id;
                        verPedidosCliente(clienteId);
                    });
                    tdAcoes.appendChild(btnDetalhes);
                    tr.appendChild(tdAcoes);
                    
                    clientesTableBody.appendChild(tr);
                });
            } else {
                console.error('Erro ao carregar clientes:', data.error);
            }
        })
        .catch(error => console.error('Erro ao buscar clientes:', error));
});


function verPedidosCliente(clienteId) {
    fetch(`/admin/clientes/pedidos/${clienteId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const pedidos = data.pedidos;
                const listaPedidos = document.querySelector('#pedidosLista');

                listaPedidos.innerHTML = '';

                pedidos.forEach(pedido => {
                    let produtosHtml = '';

                    pedido.produtos.forEach(produto => {
                        produtosHtml += `
                            <p><strong>Nome:</strong> ${produto.nome}</p>
                            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
                            <p><strong>Valor:</strong> R$ ${produto.valor.toFixed(2)}</p>
                            <hr>
                        `;
                    });

                    const pedidoDiv = document.createElement('div');
                    pedidoDiv.innerHTML = `
                        <h3>Pedido ID: ${pedido.id}</h3>
                        ${produtosHtml}
                        <p><strong>Total do Pedido:</strong> R$ ${pedido.total.toFixed(2)}</p>
                        <hr>
                    `;
                    listaPedidos.appendChild(pedidoDiv);
                });

                document.getElementById('pedidoModal').style.display = 'block';
            } else {
                alert('Erro ao obter pedidos.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar pedidos:', error);
            alert('Erro inesperado ao buscar pedidos.');
        });
}



document.getElementById('voltarBtn').addEventListener('click', function() {

    sessionStorage.clear();
    window.location.href = '/admin/';
  });