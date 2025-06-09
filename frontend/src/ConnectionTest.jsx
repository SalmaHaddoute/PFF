import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ConnectionTest() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/test-connection');
        setApiResponse(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div>Testing connection to Laravel API...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Connection Test Results</h2>
      <div style={{ textAlign: 'left' }}>
        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      </div>
      <p style={{ color: 'green', fontWeight: 'bold' }}>
        ✓ Successfully connected to Laravel API
      </p>
    </div>
  );
}