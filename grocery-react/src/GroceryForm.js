import React, { useState, useEffect } from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import { Form, Button, Card, Container, List, Message } from 'semantic-ui-react';

const GroceryForm = props => {
  const TYPE_INGREDIENT = "ingredient"
  const TYPE_RECIPE = "recipe"
  const [username, setUsername] = useState(props.username ? props.username : '')
  const ingredientOptions = [{ name: 'Apple', id: 1, type: TYPE_INGREDIENT }, { name: 'Banana', id: 2, type: TYPE_INGREDIENT }, { name: 'Ice cream', id: 3, type: TYPE_INGREDIENT }]
  const recipeOptions = [
    { name: 'Garlic Chicken (Butter, Chicken breast, Garlic powder, Onion powder, salt)', id: 1, type: TYPE_RECIPE },
    { name: 'Butternut Squash (Butternut squash, Olive Oil, Garlic, Salt, Ground Black Pepper)', id: 2, type: TYPE_RECIPE },
    { name: 'Brown Butter-Basted Steak (thick bone-in rib eye, salt, ground pepper, rosemary, garlic, unsalted butter)', id: 3, type: TYPE_RECIPE }
  ]
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedRecipes, setSelectedRecipes] = useState([])
  const [outputUserName, setOutputUserName] = useState('')
  const [outputIngredients, setOutputIngredients] = useState([])
  const [outputRecipes, setOutputRecipes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    setOutputRecipes(outputRecipes)
  }, [outputRecipes])

  return (
    <Container>
      <Form>
        {username ? 'Hello, ' + username : ''}
        <p>Enter your name:</p>
        <Form.Field>
          <input
            type='text'
            onChange={e => setUsername(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Multiselect
            options={ingredientOptions} // Options to display in the dropdown
            selectedValues={selectedIngredients} // Preselected value to persist in dropdown
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            placeholder="Select items to purchase"
            id="ingredients"
          />
        </Form.Field>

        <Form.Field>
          <Multiselect
            options={recipeOptions} // Options to display in the dropdown
            selectedValues={selectedRecipes} // Preselected value to persist in dropdown
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
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
            const response = await fetch('/api/request', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
            })

            if (response.ok) {
              console.log('response successful')
              let result = await response.text()
              console.log(result)
              console.log(JSON.parse(result))
              result = JSON.parse(result)
              setOutputUserName(result.userName)
              setOutputIngredients(result.ingredients)
              setOutputRecipes(result.recipes)
              setIsLoading(false)

            } else {
              console.log('response failed')
              setIsLoading(false)
            }

          }}>Submit</Button>
        </Form.Field>
      </Form>

      {submitted && outputUserName && (outputIngredients || outputRecipes) ?
        <Card fluid color='yellow' >
          <Card.Content header={`Shopping Instructions for ${outputUserName}`} />
          <Card.Content>
            <Card.Description>
              <List bulleted>
                {outputIngredients && outputIngredients.map(ingredient => {
                  console.log('got in output ingredients map!!')
                  console.log(ingredient)
                  return (
                    <List.Item key={ingredient.name}>{ingredient.name}</List.Item>
                  )
                })}

                {outputRecipes && outputRecipes.map(recipe => {
                  console.log('got in output recipe map!!')
                  console.log(recipe)
                  return (
                    <List.Item key={recipe.name}>{recipe.name}</List.Item>
                  )
                })}
              </List>

            </Card.Description>
          </Card.Content>
        </Card>
        : submitted &&
        <Message color="red">Please provide your name and select at least one item from the grocery shopping dropdowns</Message>
      }
    </Container>
  );
}

export default GroceryForm