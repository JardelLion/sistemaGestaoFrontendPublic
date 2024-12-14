import React, { useEffect, useState } from 'react';
import { getResources, updatePermissions } from '../services/authService';

const PermissionsManager = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Função para carregar os dados das permissões
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const data = await getResources('/api/permissions');
        setPermissions(data);
      } catch (err) {
        setError('Erro ao carregar permissões: ' + err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Função para atualizar as permissões de um funcionário
  const handleUpdatePermissions = async (employeeId) => {
    setIsUpdating(true);
    try {
      await updatePermissions('/api/permissions', employeeId, selectedPermissions[employeeId]);
      alert('Permissões atualizadas com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar permissões: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Gerenciamento de Permissões</h2>
      <table>
        <thead>
          <tr>
            <th>Nome do Funcionário</th>
            <th>Permissões</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.id}>
              <td>{permission.employeeName}</td>
              <td>
                <div>
                  {permission.actions.map((action) => (
                    <label key={action}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions[permission.id]?.includes(action)}
                        onChange={() => {
                          setSelectedPermissions((prev) => {
                            const updated = { ...prev };
                            if (updated[permission.id]?.includes(action)) {
                              updated[permission.id] = updated[permission.id].filter((a) => a !== action);
                            } else {
                              updated[permission.id] = [...(updated[permission.id] || []), action];
                            }
                            return updated;
                          });
                        }}
                      />
                      {action}
                    </label>
                  ))}
                </div>
              </td>
              <td>
                <button onClick={() => handleUpdatePermissions(permission.id)} disabled={isUpdating}>
                  {isUpdating ? 'Atualizando...' : 'Atualizar Permissões'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsManager;
