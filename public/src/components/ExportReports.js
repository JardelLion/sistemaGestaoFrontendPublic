import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';
import '../styles/styles.css'; // Arquivo de CSS atualizado

const ExportReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [employees, setEmployees] = useState([]); // Lista de funcionários
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exportAll, setExportAll] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  // Carrega dados de vendas
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const result = await getResources('/api/get-sales-history');
        setSalesData(result || []);
      } catch (error) {
        console.error('Erro ao buscar histórico de vendas:', error);
        setSalesData([]);
      } finally {
        setLoadingSales(false);
      }
    };

    fetchSalesData();
  }, []);

  // Carrega lista de funcionários
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await getResources('/api/get-employees'); // Nova API para buscar funcionários
        setEmployees(result || []);
      } catch (error) {
        console.error('Erro ao buscar lista de funcionários:', error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      const payload = {
        funcionario: exportAll ? null : selectedEmployee,
        data: exportAll ? null : selectedDate,
        formato: exportFormat
      };

      const data = await getResources('/api/export-sales', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      const filename = `relatorio_vendas.${exportFormat}`;
      downloadFile(data, filename);
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    }
  };

  const openModal = (format) => {
    setExportFormat(format);
    setShowModal(true);
  };

  return (
    <div className="export-reports">
      <h2>Exportar Relatórios de Vendas</h2>
      {loadingSales || loadingEmployees ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <button className="btn-export" onClick={() => openModal('csv')}>
            Exportar como CSV
          </button>
          <button className="btn-export" onClick={() => openModal('pdf')}>
            Exportar como PDF
          </button>
        </>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Deseja exportar vendas de todos os funcionários?</h3>
            <div className="modal-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="exportOption"
                  value="all"
                  checked={exportAll}
                  onChange={() => setExportAll(true)}
                />
                Todos os funcionários
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="exportOption"
                  value="individual"
                  checked={!exportAll}
                  onChange={() => setExportAll(false)}
                />
                Apenas um funcionário
              </label>
            </div>

            {!exportAll && (
              <div className="filter-options">
                <label>
                  Funcionário:
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Selecione um funcionário</option>
                    {employees.map((employee, index) => (
                      <option key={index} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Data/Mês:
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </label>
              </div>
            )}

            <button className="btn-confirm" onClick={handleExport}>
              Exportar como {exportFormat.toUpperCase()}
            </button>
            <button className="btn-cancel" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportReports;
