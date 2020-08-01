import React, { useState, useEffect } from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
// import {FormControl, Form} from 'react-bootstrap'
import {Form, Button} from 'semantic-ui-react';

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

  const onSelect = (selectedList, selectedItem) => {
    console.log('got here')
    const typeUpdated = selectedItem.type
    console.log(selectedItem.type)
    console.log('selectedValues', selectedIngredients)
    console.log('selected list', selectedList)
    console.log('selected item type', typeUpdated)
    // setSelectedValues

    if (typeUpdated === TYPE_INGREDIENT) {
      setSelectedIngredients(selectedList)
    } else if (typeUpdated === TYPE_RECIPE) {
      setSelectedRecipes(selectedList)
    }
    console.log('selectedValues', selectedIngredients)
  }

  const onRemove = (removedList, removedItem) => {
    console.log('in remove')
    console.log('removed list', removedList)
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

  return (
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
        <div className="flex-box">
        <Multiselect
        options={ingredientOptions} // Options to display in the dropdown
        selectedValues={selectedIngredients} // Preselected value to persist in dropdown
        onSelect={onSelect} // Function will trigger on select event
        onRemove={onRemove} // Function will trigger on remove event
        displayValue="name" // Property name to display in the dropdown options
        placeholder="Select items to purchase"
        id="ingredients"
      />
      </div>
      </Form.Field>

      <Form.Field>
        <div className="flex-box">
        <Multiselect
        options={recipeOptions} // Options to display in the dropdown
        selectedValues={selectedRecipes} // Preselected value to persist in dropdown
        onSelect={onSelect} // Function will trigger on select event
        onRemove={onRemove} // Function will trigger on remove event
        displayValue="name" // Property name to display in the dropdown options
        placeholder="Select recipes to purchase"
        id="recipes"
      />
      </div>
      </Form.Field>

      <Form.Field>
        <Button onClick={async () => {
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
            const result = await response.text()
            console.log(result)
            console.log(JSON.parse(result))

          } else {
            console.log('response failed')
          }

        }}>Submit</Button>
      </Form.Field>
    </Form>

  );
}

export default GroceryForm