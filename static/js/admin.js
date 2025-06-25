document.addEventListener('DOMContentLoaded', function() {

    fetch('/admin/resumo')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                document.getElementById('total-clientes').textContent = data.total_clientes;
                document.getElementById('total-vendas-finalizadas').textContent = data.total_vendas_finalizadas;
                document.getElementById('total-vendas-andamento').textContent = data.total_vendas_andamento;
                document.getElementById('total-vendas-canceladas').textContent = data.total_vendas_canceladas;
            } else {
                alert('Erro ao carregar os dados do resumo');
            }
        })
        .catch(error => {
            console.error('Erro ao obter o resumo:', error);
            alert('Erro inesperado ao carregar os dados');
        });
});


document.getElementById('logoutBtn').addEventListener('click', function() {

    sessionStorage.clear();
    window.location.href = '/usuarios/';
  });