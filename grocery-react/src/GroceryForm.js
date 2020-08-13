import React, { useState, useEffect, Fragment } from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import { Form, Button, Card, Container, List, Message } from 'semantic-ui-react';
import * as Constants from './DataConstants'

const GroceryForm = props => {
  const TYPE_INGREDIENT = "ingredient"
  const TYPE_RECIPE = "recipe"
  const [username, setUsername] = useState(props.username ? props.username : '')
  const itemOptions = Constants.items
  const recipeOptions = Constants.recipes
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedRecipes, setSelectedRecipes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [optimizeResult, setOptimizeResult] = useState({
    estimatedTime: null,
    instructions: []
  })

  const onSelect = (selectedList, selectedItem) => {
    const typeUpdated = selectedItem.type
    console.log('selected list', selectedList)
    console.log('selected item type', typeUpdated)

    if (typeUpdated === TYPE_INGREDIENT) {
      setSelectedIngredients(selectedList)
    } else if (typeUpdated === TYPE_RECIPE) {
      setSelectedRecipes(selectedList)
    }
  }

  const onRemove = (removedList, removedItem) => {
    console.log('in remove')
    console.log('removed item', removedItem)
    const typeUpdated = removedItem.type

    if (typeUpdated === TYPE_INGREDIENT) {
      const updatedList = selectedIngredients.filter((item) => { return item.id !== removedItem.id })
      setSelectedIngredients(updatedList)
    } else if (typeUpdated === TYPE_RECIPE) {
      const updatedList = selectedRecipes.filter((item) => { return item.id !== removedItem.id })
      setSelectedRecipes(updatedList)
    }
  }

  useEffect(() => {
    setOptimizeResult(optimizeResult)
  }, [optimizeResult])

  return (
    <Container>
      <Form>
        <h3>{username ? 'Hello, ' + username : ''}</h3>
        <p>What is your name?</p>
        <Form.Field>
          <input
            type='text'
            onChange={e => setUsername(e.target.value)}
            placeholder='name'
          />
        </Form.Field>
        <Form.Field>
          <p>Select specific items</p>
          <Multiselect
            options={itemOptions} // Options to display in the dropdown
            selectedValues={selectedIngredients} // Preselected value to persist in dropdown
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            placeholder="Select items to purchase"
            id="ingredients"
          />
        </Form.Field>

        <Form.Field>
          <p>Select from existing recipes</p>
          <Multiselect
            options={recipeOptions} // Options to display in the dropdown
            selectedValues={selectedRecipes} // Preselected value to persist in dropdown
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue="recipe" // Property name to display in the dropdown options
            placeholder="Select recipes to purchase"
            id="recipes"
          />
        </Form.Field>

        <Form.Field>
          <Button primary loading={isLoading} onClick={async () => {
            setSubmitted(true)
            setIsLoading(true)
            const requestData = {
              userName: username,
              ingredients: selectedIngredients,
              recipes: selectedRecipes
            }
            const response = await fetch('/api/optimize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
            })

            if (response.ok) {
              // console.log('response successful')
              let result = await response.text()
              // console.log(result)
              // console.log(JSON.parse(result))
              result = JSON.parse(result)
              setOptimizeResult(result)
              setIsLoading(false)
              // console.log(result.instructions)

            } else {
              // console.log('response failed')
              setIsLoading(false)
            }

          }}>Submit</Button>
        </Form.Field>
      </Form>

      {submitted && username && (optimizeResult) ?
        <Card fluid color='yellow' >
          <Card.Content header={`Shopping Instructions for ${username}`} />
          <Card.Content>
            <Card.Description>
              {optimizeResult.time && <p>Estimated time required: {optimizeResult.time} minutes</p>}
              <List bulleted>
                {optimizeResult && optimizeResult.instructions.map(step => {
                  return (
                    <Fragment>
                      <List.Item key={step.section}>{step.section}</List.Item>
                      <List.List>
                        {
                          step.items.map(item => {
                              return (
                              <li>{item}</li>
                            )
                            
                          })
                        }
                      </List.List>
                    </Fragment>

                  )
                })}
              </List>

            </Card.Description>
          </Card.Content>
        </Card>
        : submitted && !isLoading &&
        <Message color="red">Please provide your name and select at least one item from the grocery shopping dropdowns</Message>
      }
    </Container>
  );
}

export default GroceryForm