from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Produto(Base):
    __tablename__ = 'produtos'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    valor = Column(Float)
    tipo = Column(String)
    descricao = Column(String)
    quantidade = Column(Integer)

    pedidos = relationship('PedidoProduto', back_populates='produto')


class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    senha = Column(String(255), nullable=False)
    tipo = Column(String(50), nullable=False, default="cliente")
    
    pedidos = relationship('Pedido', back_populates='usuario')


class Pedido(Base):
    __tablename__ = 'pedidos'

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    status = Column(String(50), default='pendente')
    nome_pedido = Column(String(255))

    usuario = relationship('Usuario', back_populates='pedidos')
    produtos = relationship('PedidoProduto', back_populates='pedido')


class PedidoProduto(Base):
    __tablename__ = 'pedidos_produtos'

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey('pedidos.id'))
    produto_id = Column(Integer, ForeignKey('produtos.id'))
    quantidade = Column(Integer, nullable=False, default=1)

    pedido = relationship('Pedido', back_populates='produtos')
    produto = relationship('Produto', back_populates='pedidos')