# README do Projeto de E-commerce

## Descrição
Este projeto é uma aplicação web de e-commerce desenvolvida em Python utilizando o framework Flask. O sistema permite que administradores gerenciem produtos e clientes, enquanto os usuários podem visualizar produtos, adicionar itens ao carrinho e realizar pedidos.

## Funcionalidades
- **Painel do Administrador**: 
  - Visualização de resumo administrativo (total de clientes, vendas finalizadas, em andamento e canceladas).
  - Gerenciamento de produtos (adicionar, atualizar e deletar produtos).
  - Controle de clientes (listar clientes e visualizar detalhes dos pedidos).

- **Carrinho de Compras**: 
  - Adição de produtos ao carrinho.
  - Visualização do carrinho com detalhes dos produtos e total.
  - Realização de pedidos.

- **Gerenciamento de Pedidos**: 
  - Listagem de pedidos realizados pelo cliente.
  - Opções para pagar, cancelar ou apagar pedidos.

## Tecnologias Utilizadas
- **Backend**: Python, Flask
- **Banco de Dados**: SQLite com SQLAlchemy
- **Frontend**: HTML, CSS, JavaScript
- **Controle de Versão**: Git

## Estrutura de Diretórios
```
/site
│
├── .git/                  # Diretório do Git
├── .idea/                 # Configurações do IDE
├── admin.py               # Rotas e lógica do painel do administrador
├── app.py                 # Inicialização da aplicação Flask
├── cliente.py             # Rotas e lógica do cliente
├── database.py            # Configuração do banco de dados
├── models.py              # Definição dos modelos de dados
├── produtos.py            # Rotas e lógica de produtos
├── usuarios.py            # Rotas e lógica de usuários
├── static/                # Arquivos estáticos (CSS, JS, imagens)
│   ├── css/
│   ├── js/
│   └── ...
├── templates/             # Templates HTML
│   ├── admin.html
│   ├── admin_clientes.html
│   ├── admin_produtos.html
│   ├── carrinho.html
│   ├── cliente.html
│   ├── login.html
│   └── pedidos.html
└── controle.db            # Banco de dados SQLite
