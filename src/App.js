import * as React from 'react';

// GraphQL
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import './App.css';

class App extends React.Component {
  componentDidMount () {
    this.props.subscribeToNewIngredients()
  }

  get ingredients () {
    const { data } = this.props;

    if (!data || !data.ingredients) return []

    return data.ingredients;
  }

  renderIngredient (ingredient) {
    return (
      <li key={ingredient.id}>{ingredient.name}</li>
    )
  }

  render () {
    return (
      <ul>
        {this.ingredients.map(this.renderIngredient)}
      </ul>
    )
  }
}

const query = gql`
 {
   ingredients {
     id
     name
    }
  }
`
const subscription = gql`
  subscription {
    newIngredient { id name }
  }
`
export default graphql(query, {
  props: props => {
    return Object.assign(props, {
      subscribeToNewIngredients: params => {
        return props.data.subscribeToMore({
          document: subscription,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const newIngredient = subscriptionData.data.newIngredient;
            return Object.assign({}, prev, {
              ingredients: [newIngredient, ...prev.ingredients]
            });
          }
        })
      }
    });
  }
})(App);
