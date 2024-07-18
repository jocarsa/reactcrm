// components/EntityList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll, remove } from '../services/apiService';
import EntityFormModal from './EntityFormModal';

const EntityList = ({ entity }) => {
  const [records, setRecords] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [entity]);

  const fetchRecords = async () => {
    const data = await getAll(entity);
    setRecords(data);
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openUpdateModal = (record) => {
    setSelectedRecord(record);
    setUpdateModalIsOpen(true);
  };
  const closeUpdateModal = () => setUpdateModalIsOpen(false);

  const handleDelete = async (id) => {
    await remove(entity, id);
    fetchRecords();
  };

  const renderTableHeaders = () => {
    if (records.length === 0) return null;
    const headers = Object.keys(records[0]).filter(key => key !== 'id');
    return (
      <tr>
        {headers.map(header => (
          <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
        ))}
        <th>Operations</th>
      </tr>
    );
  };

  const renderTableRows = () => {
    return records.map(record => (
      <tr key={record.id}>
        {Object.keys(record).filter(key => key !== 'id').map(key => (
          <td key={key}>{record[key]}</td>
        ))}
        <td key={`operations-${record.id}`}>
          <Link to={`/${entity}/${record.id}`}>View</Link>
          <button onClick={() => openUpdateModal(record)}>Edit</button>
          <button onClick={() => handleDelete(record.id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <button onClick={openModal}>Create New {entity}</button>
      <EntityFormModal
        entity={entity}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onFormSubmit={fetchRecords}
      />
      <EntityFormModal
        entity={entity}
        isOpen={updateModalIsOpen}
        onRequestClose={closeUpdateModal}
        onFormSubmit={fetchRecords}
        record={selectedRecord}
      />
      <table>
        <thead>{renderTableHeaders()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
};

export default EntityList;