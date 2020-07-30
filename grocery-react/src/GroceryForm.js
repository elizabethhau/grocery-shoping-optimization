import React, {useState} from 'react';
// import {FormControl, Form} from 'react-bootstrap'

const GroceryForm = props => {
    const [username, setUsername] = useState(props.username ? props.username : '')

    const myChangeHandler = (e) => {
        setUsername(e.target.value)
    }

    return (
      <form>
      {username ? 'Hello, ' + username : ''}
      <p>Enter your name:</p>
      <input
        type='text'
        onChange={myChangeHandler}
      />
      </form>
    );
}

export default GroceryForm