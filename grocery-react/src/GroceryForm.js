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
  // [
  //   { name: 'Garlic Chicken (Butter, Chicken breast, Garlic powder, Onion powder, salt)', id: 1, type: TYPE_RECIPE },
  //   { name: 'Butternut Squash (Butternut squash, Olive Oil, Garlic, Salt, Ground Black Pepper)', id: 2, type: TYPE_RECIPE },
  //   { name: 'Brown Butter-Basted Steak (thick bone-in rib eye, salt, ground pepper, rosemary, garlic, unsalted butter)', id: 3, type: TYPE_RECIPE }
  // ]
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedRecipes, setSelectedRecipes] = useState([])
  // const [outputInstructions, setOutputInstructions] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const [estimatedTime, setEstimatedTime] = useState()
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
    // setOutputInstructions(outputInstructions)
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
              console.log('response successful')
              let result = await response.text()
              console.log(result)
              console.log(JSON.parse(result))
              result = JSON.parse(result)
              // setOutputUserName(result.userName)
              // setEstimatedTime(result.time)
              console.log('TIME IS')
              console.log(result.time)
              // setOutputInstructions(result.instructions)
              // setOutputRecipes(result.recipes)
              setOptimizeResult(result)
              setIsLoading(false)
              console.log(result.instructions)

            } else {
              console.log('response failed')
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
                  // console.log('got in output ingredients map!!')
                  // console.log(step)
                  return (
                    <Fragment>
                      <List.Item key={step.section}>{step.section}</List.Item>
                      <List.List>
                        {
                          step.items.map(item => {
                            // console.log('got in sub list')
                            // console.log(item)
                            // if(selectedRecipes.length > 0) {
                            //   selectedRecipes.forEach(recipe => {
                            //   console.log('got in items recipe sub list!')
                            //   const ingredients = recipe.name
                            //   console.log(item + ingredients)
                            //   if (ingredients.includes(item)) {
                            //     return (<li>{item}({recipe.recipe})</li>)
                            //   } 
                            //   return (
                            //     // <List.Item key={item} content={item}/>
                            //     <li>{item}</li>
                            //   )
                              
                            // })
                            // } else {
                              return (
                              // <List.Item key={item} content={item}/>
                              <li>{item}</li>
                            )
                            // }
                            
                          })
                        }
                      </List.List>
                    </Fragment>

                  )
                })}

                {/* {outputRecipes && outputRecipes.map(recipe => {
                  console.log('got in output recipe map!!')
                  console.log(recipe)
                  return (
                    <List.Item key={recipe.name}>{recipe.name}</List.Item>
                  )
                })} */}
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