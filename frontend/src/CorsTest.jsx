import axios from 'axios';
import { useEffect, useState } from 'react';

export default function CorsTest() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

 useEffect(() => {
  const testConnection = async () => {
    try {
      // First get CSRF cookie
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
      
      // Then make your API request
      const res = await axios.get('http://localhost:8000/api/test-cors', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
      console.error('Full error:', err);
    }
  };

  testConnection();
}, []);

  return (
    <div>
      <h2>CORS Test</h2>
      {error ? (
        <div style={{ color: 'red' }}>
          Error: {error}
          <p>Check console for details</p>
        </div>
      ) : response ? (
        <div style={{ color: 'green' }}>
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <p>✓ Successfully connected!</p>
        </div>
      ) : (
        <p>Testing connection...</p>
      )}
    </div>
  );
}