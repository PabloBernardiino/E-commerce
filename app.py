from flask import Flask, redirect, url_for
from admin import admin_bp
from produtos import produtos_bp
from usuarios import usuarios_bp
from cliente import cliente_bp
from database import engine, Base
from sqlalchemy import create_engine

app = Flask(__name__, template_folder='templates')
app.secret_key = 'cyber_key_segurity'

app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(produtos_bp, url_prefix='/produtos')
app.register_blueprint(usuarios_bp, url_prefix='/usuarios')
app.register_blueprint(cliente_bp, url_prefix='/cliente')

engine = create_engine(
    'sqlite:///seubanco.db',
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    connect_args={'check_same_thread': False}
)

Base.metadata.create_all(bind=engine)

@app.route('/')
def index():
    return redirect(url_for('usuarios.index'))

if __name__ == '__main__':
    app.run(debug=True)