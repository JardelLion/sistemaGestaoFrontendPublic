import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';

const fetchData = async (url, setData, setError, setLoading) => {
  try {
    const data = await getResources(url);
    setData(data);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  } finally {
    setLoading(false);
  }
};



const AddStockItemForm = ({ onAdd, onClose }) => {
  const [products, setProducts] = useState([]); // Estado para armazenar a lista de produtos
  const [selectedProductId, setSelectedProductId] = useState(''); // ID do produto selecionado
  const [quantity, setQuantity] = useState(''); // Quantidade do produto
  const [isAvailable, setIsAvailable] = useState(true); // Disponibilidade por padrão
  const [error, setError] = useState(''); // Estado para armazenar mensagens de erro

  // Função para buscar produtos do banco de dados
  const fetchProducts = async () => {
    await fetchData(`api/products`, setProducts, setError); // Altere o URL de acordo com sua API
  };

  useEffect(() => {
    fetchProducts(); // Busca os produtos quando o componente é montado
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const newItem = {
      product_id: selectedProductId, // Altere para product_id
      quantity: parseInt(quantity, 10), // Convertendo a quantidade para número inteiro
      is_available: isAvailable, // Adicionando a disponibilidade
    };

    try {
      const result = await getResources('api/stockmanager', 'POST', newItem);

    
      onAdd(result); // Atualiza a lista de produtos no componente pai
      setSelectedProductId(''); // Reseta o produto selecionado
      setQuantity(''); // Reseta a quantidade
      setIsAvailable(true); // Reseta a disponibilidade para verdadeiro
      setError(''); // Limpa mensagem de erro ao adicionar com sucesso
    } catch (error) {
      console.error('Error adding item:', error);
      setError(error.message); // Define a mensagem de erro
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Exibe mensagem de erro */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Produto:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <option value="" disabled>Selecione um produto</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
       
        <div>
          <label>Disponível:</label>
          <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === 'true')}>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
        <button type="submit">Adicionar Item</button>
        <button type="button" onClick={onClose}>Fechar</button>
      </form>
    </div>
  );
};

export default AddStockItemForm;
