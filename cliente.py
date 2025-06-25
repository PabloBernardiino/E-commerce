from flask import Blueprint, render_template, request, jsonify, session
from database import SessionLocal
from models import Produto, Pedido, PedidoProduto

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/')
def cliente():
    return render_template('cliente.html')

@cliente_bp.route('/carrinho')
def ver_carrinho():
    return render_template('carrinho.html')

@cliente_bp.route('/pedidos')
def ver_pedidos():
    return render_template('pedidos.html')

@cliente_bp.route('/realizar_pedido', methods=['POST'])
def realizar_pedido():
    try:
        cliente_id = session.get('cliente_id')
        if not cliente_id:
            return jsonify({'success': False, 'error': 'Cliente não autenticado.'}), 401

        data = request.json
        produtos = data.get('produtos')
        nome_pedido = data.get('nomePedido')

        if not produtos or len(produtos) == 0:
            return jsonify({'success': False, 'error': 'Nenhum produto enviado.'}), 400

        session_db = SessionLocal()

        novo_pedido = Pedido(usuario_id=cliente_id, status='pendente', nome_pedido=nome_pedido)
        session_db.add(novo_pedido)
        session_db.commit()

        for item in produtos:
            produto_id = item['id']
            quantidade = item.get('quantidade', 1)

            produto = session_db.query(Produto).filter(Produto.id == produto_id).first()
            if produto:
                if produto.quantidade >= quantidade:
                    pedido_produto = PedidoProduto(pedido_id=novo_pedido.id, produto_id=produto.id, quantidade=quantidade)
                    session_db.add(pedido_produto)
                    produto.quantidade -= quantidade
                else:
                    return jsonify({'success': False, 'error': f'Estoque insuficiente para o produto {produto_id}.'}), 400
            else:
                return jsonify({'success': False, 'error': f'Produto com ID {produto_id} não encontrado.'}), 404

        session_db.commit()
        session_db.close()

        return jsonify({'success': True, 'message': 'Pedido realizado com sucesso!'}), 201

    except Exception as e:
        session_db.rollback()
        session_db.close()
        return jsonify({'success': False, 'error': str(e)}), 500



@cliente_bp.route('/pedidos/listar', methods=['GET'])
def listar_pedidos():
    try:
        cliente_id = session.get('cliente_id')
        if not cliente_id:
            return jsonify({'success': False, 'error': 'Cliente não autenticado.'}), 401

        session_db = SessionLocal()
        pedidos = session_db.query(Pedido).filter(Pedido.usuario_id == cliente_id).all()
        
        pedidos_lista = []
        for pedido in pedidos:
            pedidos_lista.append({
                'id': pedido.id,
                'nome_pedido': pedido.nome_pedido,
                'status': pedido.status,
                'produtos': [produto.id for produto in pedido.produtos]
            })

        session_db.close()

        return jsonify({'success': True, 'pedidos': pedidos_lista}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@cliente_bp.route('/pedidos/produtos/<int:pedido_id>', methods=['GET'])
def ver_produtos(pedido_id):
    try:
        usuario_id = session.get('cliente_id')
        if not usuario_id:
            return jsonify({'success': False, 'error': 'Cliente não autenticado.'}), 401

        pedido = SessionLocal().query(Pedido).filter(Pedido.id == pedido_id, Pedido.usuario_id == usuario_id).first()
        if not pedido:
            return jsonify({'success': False, 'error': 'Pedido não encontrado ou não pertence ao cliente.'}), 404

        produtos = []
        for pedido_produto in pedido.produtos:
            produto = SessionLocal().query(Produto).filter(Produto.id == pedido_produto.produto_id).first()
            if produto:
                produtos.append({
                    'nome': produto.nome,
                    'quantidade': pedido_produto.quantidade,
                    'valor': produto.valor
                })
        
        return jsonify({'success': True, 'produtos': produtos}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@cliente_bp.route('/pedidos/pagar/<int:pedido_id>', methods=['POST'])
def realizar_pagamento(pedido_id):
    try:
        usuario_id = session.get('cliente_id')
        if not usuario_id:
            return jsonify({'success': False, 'error': 'Cliente não autenticado.'}), 401

        session_db = SessionLocal()
        pedido = session_db.query(Pedido).filter(Pedido.id == pedido_id, Pedido.usuario_id == usuario_id).first()
        if not pedido:
            session_db.close()
            return jsonify({'success': False, 'error': 'Pedido não encontrado ou não pertence ao cliente.'}), 404

        pedido.status = 'pago'
        session_db.commit()
        session_db.close()

        return jsonify({'success': True, 'message': 'Pagamento realizado com sucesso!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@cliente_bp.route('/pedidos/cancelar/<int:pedido_id>', methods=['POST'])
def cancelar_pedido(pedido_id):
    try:
        cliente_id = session.get('cliente_id')
        if not cliente_id:
            return jsonify({'success': False, 'error': 'Cliente não autenticado.'}), 401

        session_db = SessionLocal()
        pedido = session_db.query(Pedido).filter(Pedido.id == pedido_id, Pedido.usuario_id == cliente_id).first()

        if not pedido:
            return jsonify({'success': False, 'error': 'Pedido não encontrado.'}), 404
        if pedido.status != 'pendente':
            return jsonify({'success': False, 'error': 'Este pedido já foi pago ou não pode ser cancelado.'}), 400
       
        for pedido_produto in pedido.produtos:
            produto = session_db.query(Produto).filter(Produto.id == pedido_produto.produto_id).first()
            if produto:
                produto.quantidade += 1

        pedido.status = 'cancelado'
        session_db.commit()
        session_db.close()

        return jsonify({'success': True, 'message': 'Pedido cancelado com sucesso!'}), 200

    except Exception as e:
        session_db.rollback()
        session_db.close()
        return jsonify({'success': False, 'error': str(e)}), 500
    
@cliente_bp.route('/pedidos/apagar/<int:pedido_id>', methods=['DELETE'])
def apagar_pedido(pedido_id):
    try:
        cliente_id = session.get('cliente_id')
        if not cliente_id:
            return jsonify({'success': False, 'error': 'Cliente não autenticado.'}), 401

        session_db = SessionLocal()

        pedido = session_db.query(Pedido).filter(Pedido.id == pedido_id, Pedido.usuario_id == cliente_id).first()
        if not pedido:
            return jsonify({'success': False, 'error': 'Pedido não encontrado.'}), 404

        session_db.delete(pedido)
        session_db.commit()
        session_db.close()

        return jsonify({'success': True, 'message': 'Pedido apagado com sucesso!'}), 200
    except Exception as e:
        session_db.rollback()
        session_db.close()
        return jsonify({'success': False, 'error': str(e)}), 500