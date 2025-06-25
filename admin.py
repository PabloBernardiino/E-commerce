from flask import Blueprint, render_template, request, jsonify, session
from database import SessionLocal
from models import Usuario, Pedido, Produto
from database import engine


admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/')
def admin():
    return render_template('admin.html')

@admin_bp.route('/produtos')
def admin_produtos():
    return render_template('admin_produtos.html')

@admin_bp.route('/clientes')
def admin_clientes():
    return render_template('admin_clientes.html')


@admin_bp.route('/resumo', methods=['GET'])
def obter_resumo():
    try:
        session_db = SessionLocal()
        
        total_clientes = session_db.query(Usuario).filter(Usuario.tipo == 'cliente').count()

        total_vendas_finalizadas = session_db.query(Pedido).filter(Pedido.status == 'pago').count()
        total_vendas_andamento = session_db.query(Pedido).filter(Pedido.status == 'pendente').count()
        total_vendas_canceladas = session_db.query(Pedido).filter(Pedido.status == 'cancelado').count()

        session_db.close()

        return jsonify({
            'success': True,
            'total_clientes': total_clientes,
            'total_vendas_finalizadas': total_vendas_finalizadas,
            'total_vendas_andamento': total_vendas_andamento,
            'total_vendas_canceladas': total_vendas_canceladas
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/clientes/listar', methods=['GET'])
def listar_clientes():
    try:
        session_db = SessionLocal()
        clientes = session_db.query(Usuario).filter(Usuario.tipo == 'cliente').all()
        clientes_lista = [{
            'id': cliente.id,
            'nome': cliente.nome,
            'historico_pedidos': [pedido.id for pedido in cliente.pedidos]
        } for cliente in clientes]
        session_db.close()
        return jsonify({'success': True, 'clientes': clientes_lista}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    

@admin_bp.route('/clientes/pedidos/<int:cliente_id>', methods=['GET'])
def ver_pedidos_cliente(cliente_id):
    try:
        pedidos = SessionLocal().query(Pedido).filter(Pedido.usuario_id == cliente_id).all()

        if not pedidos:
            return jsonify({'success': False, 'error': 'Nenhum pedido encontrado para o cliente.'}), 404

        pedidos_info = []
        for pedido in pedidos:
            total_pedido = 0
            produtos = []
            for pedido_produto in pedido.produtos:
                produto = SessionLocal().query(Produto).filter(Produto.id == pedido_produto.produto_id).first()
                if produto:
                    produtos.append({
                        'nome': produto.nome,
                        'quantidade': pedido_produto.quantidade,
                        'valor': produto.valor
                    })
                    total_pedido += pedido_produto.quantidade * produto.valor

            pedidos_info.append({
                'id': pedido.id,
                'produtos': produtos,
                'total': total_pedido
            })

        return jsonify({'success': True, 'pedidos': pedidos_info}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500