import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import GroceryForm from './GroceryForm';
import { Container, Grid, Image, List } from 'semantic-ui-react';
import logo from './logo.jpeg'

function App() {

  return (
    <Container>
      <main>
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
              <p>Angelica’s proprietary optimization technology will then determine the optimal route for your grocery store visit along with the items to pick-up as you go. Enjoy!  </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      <GroceryForm></GroceryForm>
      </main>
      
    </Container>
  );
}

export default App;
