import React, { useState, useEffect } from "react";
import { getResources } from "../services/authService";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({ name: "", description: "" });
  const [selectedStock, setSelectedStock] = useState(""); // Estoque selecionado para edição e desativação
  const [loading, setLoading] = useState(false);

  // Função para lidar com as alterações nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };
  // Função para buscar os estoques da API
  const fetchData = async () => {
    try {
      const data = await getResources("api/create-stock", "GET");
      if (data && Array.isArray(data)) {
        setStocks(data);
      } else {
        console.error("Dados inválidos recebidos da API:", data);
        alert("Erro ao carregar os estoques.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Não foi possível carregar os estoques.");
    }
  };

  // Carregar os estoques ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  // Função para adicionar um novo estoque
  const addStock = async () => {
    if (!newStock.name || !newStock.description) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await getResources("api/create-stock", "POST", newStock);
      setStocks((prevStocks) => [...prevStocks, response.data]);
      setNewStock({ name: "", description: "" });
    } catch (error) {
      console.error("Erro ao adicionar estoque:", error);
      alert("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
      fetchData();
    }
  };

  // Função para ativar um estoque
  const activateStock = async (stockId) => {
    if (!selectedStock) {
      alert("Selecione um estoque para ativar.");
      return;
    }

    setLoading(true);
    try {
      const response = await getResources(`api/stock-reference/${stockId}/activate`, "POST", {
        stockId: selectedStock,
        status: "active",
      });

    } catch (error) {
      console.error("Erro ao ativar estoque:", error);
      alert("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  // Função para desativar um estoque
  const deactivateStock = async (stockId) => {
    if (!stockId) return;

    setLoading(true);
    try {
      const response = await getResources(`api/stock-reference/${stockId}/deactivate`, "POST", {
        stockId,
        status: "inactive",
      });

    } catch (error) {
      console.error("Erro ao desativar estoque:", error);
      alert("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir um estoque
  const deleteStock = async (stockId) => {
    if (!stockId) return;

    if (window.confirm("Tem certeza de que deseja excluir este estoque?")) {
      setLoading(true);
      try {
        const response = await getResources(`api/stock-reference/${stockId}/delete`, "DELETE");

      } catch (error) {
        console.error("Erro ao excluir estoque:", error);
        alert("Erro ao conectar com a API.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Gestão de Estoques</h1>

      {/* Formulário de Adição */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Adicionar Estoque</h2>
        <input
          type="text"
          name="name"
          placeholder="Nome do Estoque"
          value={newStock.name}
          onChange={handleInputChange}
          style={{ margin: "5px", padding: "8px", width: "100%" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={newStock.description}
          onChange={handleInputChange}
          style={{ margin: "5px", padding: "8px", width: "100%" }}
        />
        <button
          onClick={addStock}
          style={{ padding: "10px 15px", marginTop: "10px" }}
          disabled={loading}
        >
          {loading ? "Adicionando..." : "Adicionar Estoque"}
        </button>
      </div>

      {/* Botão para Ativar Estoque */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Ativar Estoque</h2>
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          style={{ margin: "5px", padding: "8px", width: "100%" }}
        >
          <option value="">Selecione um estoque</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => activateStock(selectedStock)}
          style={{
            padding: "10px 15px",
            marginTop: "10px",
            backgroundColor: "#007BFF", // Cor azul
            color: "white", // Texto branco
            border: "none", // Sem borda
            borderRadius: "5px", // Borda arredondada
          }}
          disabled={loading}
        >
          {loading ? "Ativando..." : "Ativar Estoque"}
        </button>
      </div>

      {/* Lista de Estoques */}
      <div>
        <h2>Estoques Cadastrados</h2>
        {stocks.length === 0 ? (
          <p>Nenhum estoque cadastrado ainda.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stocks.map((stock, index) => (
              stock && stock.name && stock.description ? (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  <strong>{stock.name}</strong>
                  <p>Descrição: {stock.description}</p>
                  <button
                    onClick={() => deactivateStock(stock.id)}
                    style={{
                      backgroundColor: "#D0021B", // Cor laranja suave para desativar
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      marginRight: "10px",
                      fontSize: "14px",
                    }}
                  >
                    Desativar
                  </button>
                  <button
                    onClick={() => deleteStock(stock.id)}
                    style={{
                      backgroundColor: "#D0021B", // Cor vermelha forte para excluir
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Excluir
                  </button>
                </li>
              ) : (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    background: "#f9c2c2",
                  }}
                >
                  <strong>Erro no estoque</strong>
                  <p>Dados inválidos para o estoque.</p>
                </li>
              )
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
