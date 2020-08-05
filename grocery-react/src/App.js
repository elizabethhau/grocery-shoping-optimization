import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import GroceryForm from './GroceryForm';
import { Container } from 'semantic-ui-react';

// utility threshold...? Do you HAVE to get everything 
// Do you have a personal goal/ diet? high protein diet, low sugar, low fat, low carb, child's best diet (swedish fish + ice cream)
function App() {
  const [result, setResult] = useState(null);
  useEffect(() => {
    // async function getResult() {
    //   const res = await fetch('/api/index');
    //   const result = await res.text();
    //   setResult(result);
    // }
    // getResult();
    async function getGurobiResult() {
      console.log('making call')
      const res = await fetch('/api/gurobi_test')
      const result = await res.text()
      setResult(result)
    }
    getGurobiResult();
  }, []);
  return (
    <Container>
      <h1>Angelica - Your Google Maps for Grocery Shopping</h1>
      <h2>The date according to Python is:</h2>
      <p>{result ? result : 'Loading result...'}</p>
      <GroceryForm></GroceryForm>
    </Container>
  );
}

export default App;
