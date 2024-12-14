import React, { useState } from 'react';
import { getResources } from '../services/authService';

const SalesForm = ({ products, token }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Por favor, selecione um produto.');
      return;
    }

    const sale = {
      product_id: selectedProduct,
      quantity,
    };

    try {
      const data = await getResources('api/cart/add', 'POST', sale);

      if (data.error) {
        throw new Error(data.error || 'Erro desconhecido ao adicionar ao carrinho');
      }

      setSelectedProduct('');
      setQuantity(1);
      setSearchTerm('');
      setShowProductList(false);

      setInterval(function() {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert(`Erro ao adicionar ao carrinho: ${error.message}`);
    }
  };

  if (!Array.isArray(products)) {
    return <div>Erro: Lista de produtos não disponível.</div>;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product.id);
    setSearchTerm(product.name);
    setShowProductList(false);  // Esconde a lista após seleção
  };

  return (
    <form onSubmit={handleSubmit} className="sales-form">
      <label htmlFor="search">Buscar Produto:</label>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onClick={() => setShowProductList(true)}  // Mostra a lista ao clicar
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite para buscar um produto"
      />

      {showProductList && (
        <div className="product-list" style={{
           height: '200px', 'overflow-y': "scroll"
        }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="product-item"
              style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ddd' }}
            >
              {product.name}
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ padding: '5px', color: '#999', }}>Nenhum produto encontrado</div>
          )}
        </div>
      )}

      <label htmlFor="quantity">Quantidade:</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />

      <button type="submit">Adicionar ao Carrinho</button>
    </form>
  );
};

export default SalesForm;
