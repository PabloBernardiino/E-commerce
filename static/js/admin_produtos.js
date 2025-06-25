document.addEventListener('DOMContentLoaded', function () {
  const adicionarForm = document.getElementById('adicionarForm');
  const atualizarForm = document.getElementById('atualizarForm');
  const mostrarAdicionarFormBtn = document.getElementById('mostrarAdicionarFormBtn');
  const cancelarAdicionarBtn = document.getElementById('cancelarAdicionarBtn');
  const cancelarAtualizarBtn = document.getElementById('cancelarAtualizarBtn');

  mostrarAdicionarFormBtn.addEventListener('click', function () {
    adicionarForm.style.display = 'block';
    atualizarForm.style.display = 'none';
  });
  cancelarAdicionarBtn.addEventListener('click', function () {
    adicionarForm.style.display = 'none';
    adicionarForm.reset();
  });
  cancelarAtualizarBtn.addEventListener('click', function () {
    atualizarForm.style.display = 'none';
    atualizarForm.reset();
  });

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
          const tbody = document.querySelector('#produtosTable tbody');
          tbody.innerHTML = '';

          data.produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.valor}</td>
                    <td>${produto.tipo}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.quantidade}</td>
                    <td>
                      <button class="btn-update" onclick="mostrarFormularioAtualizar(${produto.id}, '${produto.nome}', '${produto.valor}', '${produto.tipo}', '${produto.descricao}', '${produto.quantidade}')">Atualizar</button>
                      <button class="btn-delete" onclick="deletarProduto(${produto.id})">Deletar</button>
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

  window.mostrarFormularioAtualizar = function (id, nome, valor, tipo, descricao, quantidade) {
    adicionarForm.style.display = 'none';
    atualizarForm.style.display = 'block';
  
    document.getElementById('produtoIdAtualizar').value = id;
    document.getElementById('nomeAtualizar').value = nome;
    document.getElementById('valorAtualizar').value = valor;
    document.getElementById('tipoAtualizar').value = tipo;
    document.getElementById('descricaoAtualizar').value = descricao;
    document.getElementById('quantidadeAtualizar').value = quantidade;
  }


  window.deletarProduto = function (id) {
    if (confirm(`Tem certeza que deseja deletar este produto?`)) {
        fetch(`/produtos/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.message) {  
                if (response.ok) {  
                    alert('Produto deletado com sucesso!');
                    listarProdutos();
                } else {
                    alert('Erro ao deletar produto: ' + data.message);
                }
            } else {
                alert('Erro desconhecido ao deletar produto.');
            }
        })
        .catch(error => {
            console.error('Erro ao deletar produto:', error);
            alert('Erro ao deletar produto: ' + error.message);
        });
    }
}



  document.getElementById('adicionarForm').addEventListener('submit', function (event) {
    event.preventDefault();


    const nome = document.getElementById('nome').value;
    const valor = document.getElementById('valor').value;
    const tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricao').value;
    const quantidade = document.getElementById('quantidade').value;

    const novoProduto = {
        nome: nome,
        valor: parseFloat(valor),
        tipo: tipo,
        descricao: descricao,
        quantidade: parseInt(quantidade)
    };

    fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto)
  })
  
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar produto');
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
            listarProdutos();
            adicionarForm.reset();
            adicionarForm.style.display = 'none';
        } else {
            alert('Erro ao adicionar produto');
        }
    })
    .catch(error => {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto: ' + error.message);
    });
});



  document.querySelector('#atualizarForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const id = document.getElementById('produtoIdAtualizar').value;
    const nome = document.getElementById('nomeAtualizar').value;
    const valor = document.getElementById('valorAtualizar').value;
    const tipo = document.getElementById('tipoAtualizar').value;
    const descricao = document.getElementById('descricaoAtualizar').value;
    const quantidade = document.getElementById('quantidadeAtualizar').value;

    const produtoAtualizado = { nome, valor, tipo, descricao, quantidade };

    fetch(`/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoAtualizado)
  })
  .then(response => {
      if (!response.ok) {
          return response.text().then(text => {
              console.error('Erro na requisição:', text);
              throw new Error(text);
          });
      }
      return response.json();
  })
  .then(data => {
      console.log(data);
      if (data.message) {
          alert(data.message);
          listarProdutos();
          atualizarForm.style.display = 'none';
      } else {
          alert('Erro ao atualizar produto: ' + (data.error || 'Erro desconhecido'));
      }
  })
  .catch(error => {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto: ' + error.message);
  });
  
  });
  listarProdutos();
});

document.getElementById('voltarBtn').addEventListener('click', function() {

  sessionStorage.clear();
  window.location.href = '/admin/';
});