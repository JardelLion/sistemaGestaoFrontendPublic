import React from 'react';
import { useState, useEffect } from 'react';
import { getResources } from '../services/authService';


const SalesHistory = () => {
    const [salesData, setSalesData] = useState([]);
    const [filteredProductData, setFilteredProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('access'); // Supondo que você armazena o token no localStorage
    const id = localStorage.getItem("employee_id")

  

    const fetchData = async (url, setData) => {
        try {
          const data = await getResources(url); // Usa a função getResources
          setData(data);
      
          if (setData === setProductData) {
            setFilteredProductData(data);
          }
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
          setError(`Não foi possível carregar os dados de ${url.split('/')[2]}.`);
        }
      };

    useEffect(() => {
        const fetchAllData = async () => {
         
          await Promise.all([
            fetchData(`api/employee/${id}/sales`, setSalesData),
          ]);
         
        };
        fetchAllData();
      }, []);

    // Verifique se salesData e salesData.sales estão disponíveis
    if (!salesData || !salesData.sales || salesData.sales.length === 0) {
        return <p>Nenhuma venda registrada.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
                {salesData.sales.map((sale) => (
                    <tr key={sale.id}>
                        <td>{sale.product_name}</td>
                        <td>{sale.total_quantity}</td>
                        <td>{sale.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SalesHistory;
