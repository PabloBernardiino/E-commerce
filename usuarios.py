from flask import request, jsonify, render_template, Blueprint, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from database import SessionLocal
from models import Usuario

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/')
def index():
    return render_template('login.html')

@usuarios_bp.route('/', methods=['POST'])
def cadastrar_usuario():
    try:
        data = request.json
        senha_hash = generate_password_hash(data['senha'])
        novo_usuario = Usuario(
            nome=data['nome'],
            email=data['email'],
            senha=senha_hash,
            tipo=data.get('tipo', 'cliente')
        )

        session_db = SessionLocal()
        session_db.add(novo_usuario)
        session_db.commit()
        session_db.close()

        return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': 'Erro ao cadastrar usuário.', 'details': str(e)}), 500

@usuarios_bp.route('/login', methods=['POST'])
def login_usuario():
    try:
        data = request.json
        session_db = SessionLocal()
        usuario = session_db.query(Usuario).filter(Usuario.email == data['email']).first()
        session_db.close()

        if usuario and check_password_hash(usuario.senha, data['senha']):
            session['cliente_id'] = usuario.id
            if usuario.tipo == 'admin':
                return jsonify({'redirect_url': '/admin'})
            elif usuario.tipo == 'cliente':
                return jsonify({'redirect_url': '/cliente'})
        else:
            return jsonify({'error': 'Credenciais inválidas.'}), 401
    except Exception as e:
        return jsonify({'error': 'Erro ao realizar login.', 'details': str(e)}), 500