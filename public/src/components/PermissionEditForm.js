import React, { useState } from 'react';

const PermissionEditForm = ({ permission, onSubmit, onCancel }) => {
  const [name, setName] = useState(permission.name);
  const [description, setDescription] = useState(permission.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...permission, name, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome da Permissão:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Descrição:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default PermissionEditForm;
