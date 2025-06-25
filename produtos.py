from flask import Flask, request, jsonify, render_template, Blueprint
from database import SessionLocal
from models import Produto

produtos_bp = Blueprint('produtos', __name__)
app = Flask(__name__)

@produtos_bp.route('/produtos')
def produtos():
    return render_template('admin_produtos.html')


@produtos_bp.route('/', methods=['POST'])
def adicionar_produto():
    try:
        data = request.json
        session = SessionLocal()
        novo_produto = Produto(
            nome = data['nome'],
            valor = data['valor'],
            tipo = data['tipo'],
            descricao = data['descricao'],
            quantidade = data['quantidade']
        )

        session.add(novo_produto)
        session.commit()
        session.close()

        return jsonify({'message': 'Produto adicionado com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': 'Erro ao adicionar produto.', 'details': str(e)}), 500



@produtos_bp.route('/listar', methods=['GET'])
def listar_produtos():
    try:
        session = SessionLocal()
        produtos = session.query(Produto).all()
        session.close()

        produtos_lista = []
        for produto in produtos:
            produtos_lista.append({
                'id': produto.id,
                'nome': produto.nome,
                'valor': produto.valor,
                'tipo': produto.tipo,
                'descricao': produto.descricao,
                'quantidade': produto.quantidade
            })
        return jsonify({'produtos': produtos_lista})
    except Exception as e:
        return jsonify({'error': 'Erro ao listar produtos.', 'details': str(e)}), 500


@produtos_bp.route('/<int:produto_id>', methods=['PUT'])
def atualizar_produto(produto_id):
    try:
        data = request.json
        session = SessionLocal()
        produto = session.query(Produto).filter(Produto.id == produto_id).first()

        if produto:
            produto.nome = data.get('nome', produto.nome)
            produto.valor = data.get('valor', produto.valor)
            produto.tipo = data.get('tipo', produto.tipo)
            produto.descricao = data.get('descricao', produto.descricao)
            produto.quantidade = data.get('quantidade', produto.quantidade)

            session.commit()
            session.close()

            return jsonify({'message': 'Produto atualizado com sucesso!'}), 200
        else:
            session.close()
            return jsonify({'error': 'Produto não encontrado.'}), 404
    except Exception as e:
        return jsonify({'error': 'Erro ao atualizar produto.', 'details': str(e)}), 500


@produtos_bp.route('/<int:produto_id>', methods=['DELETE'])
def deletar_produto(produto_id):
    try:
        session = SessionLocal()
        produto = session.query(Produto).filter(Produto.id == produto_id).first()

        if produto:
            session.delete(produto)
            session.commit()
            session.close()

            return jsonify({'message': 'Produto deletado com sucesso!'}), 200
        else:
            session.close()
            return jsonify({'error': 'Produto não encontrado.'}), 404
    except Exception as e:
        return jsonify({'error': 'Erro ao deletar produto.', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)