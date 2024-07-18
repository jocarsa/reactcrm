// components/EntityDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EntityDetail = ({ entity }) => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${entity}/${id}`);
        setRecord(response.data[0]);
      } catch (error) {
        console.error('Error fetching record:', error);
      }
    };

    fetchRecord();
  }, [entity, id]);

  if (!record) return <div>Loading...</div>;

  return (
    <div>
      <h1>Details of {entity.charAt(0).toUpperCase() + entity.slice(1)}</h1>
      <ul>
        {Object.entries(record).map(([key, value]) => (
          <li key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntityDetail;
