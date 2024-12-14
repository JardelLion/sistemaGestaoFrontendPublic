import React, { useState, useEffect } from 'react';
import AddStockItemForm from './AddStockItemForm'; // Importando o componente de adição de item
import EditStockItemForm from './EditStockItemForm'; // Novo componente de formulário para editar

import { getResources } from '../services/authService';

const StockManager = ({ onEdit, onDelete }) => {
  const [stockItems, setStockItems] = useState([]); // Estado para armazenar os itens de estoque
  const [isAdding, setIsAdding] = useState(false); // Estado para controlar a visibilidade do formulário de adição
  const [editingItem, setEditingItem] = useState(null); // Estado para controlar o item em edição
  const [error, setError] = useState(''); // Estado para armazenar mensagens de erro
 

  // Função genérica para buscar dados
const fetchData = async (url, setData) => {
  try {
    const data = await getResources(url); // Usa a função getResource para obter os dados
    setData(data);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    setError(`Não foi possível carregar os dados de ${url.split('/')[2]}.`);
  }
};


  // Função para buscar os itens de estoque
  const fetchStockItems = () => {
    fetchData(`api/stockmanager`, setStockItems);
  };

  // Chamada para buscar os itens de estoque ao montar o componente
  useEffect(() => {
    fetchStockItems();
  }, []);

  const handleAddItem = async (newItem) => {
    try {
      await getResources(`api/stockmanager`, 'POST', newItem);
      setIsAdding(false); // Fecha o formulário após a adição
      fetchStockItems(); // Atualiza os itens do estoque após adicionar um novo
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      setError(error.message);
    }
  };

  // Função para abrir o formulário de edição com o item selecionado
  const handleEditClick = (item) => {
    setEditingItem(item); // Define o item em edição
  };

  // Função para salvar as edições do item
  const handleSaveEdit = async (updatedItem) => {
    try {
      const data = await getResources(`api/stockmanager/${updatedItem.product_id}`, 'PUT', updatedItem);
      
      if (data.error) {
        throw new Error(data.error || 'Erro desconhecido ao adicionar ao estoque');
      }
      

      setEditingItem(null); // Fecha o formulário de edição
      fetchStockItems(); // Atualiza a lista após a edição
    } catch (error) {
      console.error('Error editing item:', error);
      setError(error.message);
    }
  };

  const handleDeleteItem = async (productId, productName) => {
    if (window.confirm(`Tem certeza que deseja remover o produto ${productName} no estoque?`)) {
      try {
        await getResources(`api/stockmanager/${productId}`, 'DELETE');
        fetchStockItems(); // Atualiza a lista após a exclusão


        
      } 
      
      catch (error) {
        
      }
    }
    setInterval(function(){
      window.location.reload()
    }, 1000) // 1 second

  };

  const handleCloseForm = () => {
    setIsAdding(false); // Fecha o formulário ao clicar em "Fechar"
  };

  return (
    <div className="stock-manager">
      <h2>Gerenciamento de Estoque</h2>
      {error && <p className="error">{error}</p>}
      
      <button onClick={() => setIsAdding(true)}>Adicionar Item ao Estoque</button>
      {isAdding && <AddStockItemForm onAdd={handleAddItem} onClose={handleCloseForm} />}

      {editingItem && (
        <EditStockItemForm
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)} // Fecha o formulário de edição
        />
      )}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço de Venda</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.length === 0 ? (
            <tr>
              <td colSpan="5">Nenhum item no estoque.</td>
            </tr>
          ) : (
            stockItems.map(item => (
              <tr key={item.product_id}>
                <td>{item.product_id}</td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)} MT</td>
                <td>
                  <button onClick={() => handleEditClick(item)}>Editar</button>
                  <button onClick={() => handleDeleteItem(item.product_id, item.product_name)}>Remover</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockManager;
