document.addEventListener('DOMContentLoaded', function () {

    const mostrarCadastroBtn = document.getElementById('mostrarCadastroBtn');
    const mostrarLoginBtn = document.getElementById('mostrarLoginBtn');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const cadastroFormContainer = document.getElementById('cadastroFormContainer');

    mostrarCadastroBtn.addEventListener('click', function () {
        loginFormContainer.style.display = 'none';
        cadastroFormContainer.style.display = 'block';
    });

    mostrarLoginBtn.addEventListener('click', function () {
        loginFormContainer.style.display = 'block';
        cadastroFormContainer.style.display = 'none';
    });


    document.querySelector('#loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.querySelector('#emailLogin').value;
        const senha = document.querySelector('#senhaLogin').value;

        fetch('/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();         
            } else {
                throw new Error('Erro ao fazer login');
            }
        })
        .then(data => {
            console.log('Login bem-sucedido:', data);
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
        });
    });


    document.querySelector('#cadastroForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.querySelector('#nomeCadastro').value;
        const email = document.querySelector('#emailCadastro').value;
        const senha = document.querySelector('#senhaCadastro').value;
        const tipo = document.querySelector('#tipoCadastro').value;

        const novoUsuario = { nome, email, senha, tipo };

        fetch('/usuarios/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                loginFormContainer.style.display = 'block';
                cadastroFormContainer.style.display = 'none';
            }
        })
        .catch(error => console.error('Erro ao cadastrar usuário:', error));
    });
});