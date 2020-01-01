import React, { useState } from 'react'
import Authors from './components/Authors'
import Books, { BOOK_DETAILS, ALL_BOOKS } from './components/Books'
import Recommended from './components/Recommended'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { gql } from 'apollo-boost'
import { useApolloClient, useSubscription } from '@apollo/react-hooks'

const NEW_BOOK = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`


const App = () => {
  const [page, setPage] = useState('authors')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useSubscription(NEW_BOOK, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded
      window.alert('a book ' + book.title + ' by ' + book.author.name + ' has been added' )
      updateCacheWith(book)
    }
  })

  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  
  
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }
  

  const handleError = (error) => {
    console.log(error)
    setErrorMessage(error.message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setUser(null)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? 
        <>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
        </>
        :
        <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      {errorMessage &&
        <div style={{color: 'red'}}>
          {errorMessage}
        </div>
      }

      <Authors
        show={page === 'authors'} handleError={handleError} token={token}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'} handleError={handleError} setPage={setPage}
      />

      <LoginForm
        show={page === 'login'} handleError={handleError} setToken={setToken} setPage={setPage} setUser={setUser}
      />

      <Recommended
        show={page === 'recommend'} user={user}
      />

    </div>
  )
}

export default App