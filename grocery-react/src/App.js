import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import GroceryForm from './GroceryForm';
import { Container, Grid, Image, List } from 'semantic-ui-react';
import logo from './logo.jpeg'
// console.log(logo)

// utility threshold...? Do you HAVE to get everything 
// Do you have a personal goal/ diet? high protein diet, low sugar, low fat, low carb, child's best diet (swedish fish + ice cream)
function App() {
  // const [result, setResult] = useState(null);
  // useEffect(() => {
    // async function getResult() {
    //   const res = await fetch('/api/index');
    //   const result = await res.text();
    //   setResult(result);
    // }
    // getResult();
  //   async function getGurobiResult() {
  //     console.log('making call')
  //     const res = await fetch('/api/gurobi_test')
  //     const result = await res.text()
  //     setResult(result)
  //   }
  //   getGurobiResult();
  // }, []);
  return (
    <Container>
      <main>
      {/* <Text style={{flex: 1}}>
  <Image source={Images.IconExplore} style={{ width: 16, height: 16 }} />
  <Text> Your past has been in control for far too long. It's time to shift to a higher expression of what you are capable of so you can create the life you want to live.</Text>
</Text> */}
        <h1>Angelica – Shop Efficient Shop Intelligent</h1>
        <Grid divided='vertically'>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Image src={logo} alt='logo'/>
            </Grid.Column>
            <Grid.Column>
              <p>Welcome and thank you for choosing Angelica for your shopping needs! </p>
              <p>Plan your grocery store visit in 4 easy steps:</p>
              <List ordered>
                <List.Item>Tell me your name</List.Item>
                <List.Item>Select individual items you would like to purchase</List.Item>
                <List.Item>You may also choose from existing tasty recipes. Each recipe selected will add all required ingredients directly to your shopping list!</List.Item>
                <List.Item>Review your list and simply click the submit button to complete your order</List.Item>
              </List>
              {/* <ol></ol> */}
              {/* <p>To get started, please follow the instructions associated with each box below beginning with your name. As you select items from the drop-down menu they will be added to your grocery list. </p>
              <p>If you would like Angelica to help you with your list, you may choose from a list of Angelica’s tasty recipes. Each recipe selected from the drop-down menu will add all required ingredients directly to your shopping list!  </p>
              <p>When complete, please review your list and simply click the submit button to complete your order. </p> */}
              <p>Angelica’s proprietary optimization technology will then determine the optimal route for your grocery store visit along with the items to pick-up as you go. Enjoy!  </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/* <img src={logo} alt="logo"/> */}
      {/* <h2>The date according to Python is:</h2>
      <p>{result ? result : 'Loading result...'}</p> */}
      <GroceryForm></GroceryForm>
      </main>
      
    </Container>
  );
}

export default App;
