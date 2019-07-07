import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { hasSubscription } from '@jumpn/utils-graphql'

import absintheSocketLink from './absinthe-socket-link'

const link = new ApolloLink.split(
  operation => hasSubscription(operation.query),
  absintheSocketLink,
  createHttpLink({uri: 'http://api-dev.reciperi.com/graphql'})
)
const cache = new InMemoryCache()

export default new ApolloClient({ link, cache })
