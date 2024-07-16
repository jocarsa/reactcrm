// components/EntityDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOne } from '../services/apiService';

const EntityDetail = ({ entity }) => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      const data = await getOne(entity, id);
      setRecord(data);
    };
    fetchRecord();
  }, [entity, id]);

  if (!record) return <div>Loading...</div>;

  return (
    <div>
      <h1>Details of {entity}</h1>
      {Object.keys(record).filter(key => key !== 'id').map(key => (
        <p key={key}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {record[key]}
        </p>
      ))}
    </div>
  );
};

export default EntityDetail;
