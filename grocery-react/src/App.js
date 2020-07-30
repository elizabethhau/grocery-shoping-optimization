import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import GroceryForm from './GroceryForm';

function App() {
  const [result, setResult] = useState(null);
  useEffect(() => {
    async function getResult() {
      const res = await fetch('/api/index');
      const result = await res.text();
      setResult(result);
    }
    getResult();
  }, []);
  return (
    <main>
      <h1>Create React App + Python API!!</h1>
      <h2>The date according to Python is:</h2>
      <p>{result ? result : 'Loading result...'}</p>
      <GroceryForm></GroceryForm>
    </main>
  );
}

export default App;
