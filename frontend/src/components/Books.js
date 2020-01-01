import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

export const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  author {
    name
  }
  published
  genres
}
`

export const ALL_BOOKS = gql`
query getBooks($genre: String)
{
  allBooks(genre: $genre)  {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const ALL_GENRES = gql`
{
  allBooks {
    genres
  }
}
`


const Books = (props) => {
  const [getBooks, { called, loading, data }]  = useLazyQuery(ALL_BOOKS, {
      fetchPolicy: "network-only"
    });

  const genres = useQuery(ALL_GENRES)
  const [genre, setGenre] = useState('')

  if(!called)
  {
    getBooks()
    return null
  }

  const handleGenre = (event, newGenre) => {
    setGenre(newGenre)
    if(newGenre === '')
      getBooks()
    else
    {
      getBooks({ variables: { genre: newGenre } })
    }
  }

  if (!props.show) {
    return null
  }

  if ((called && loading) || genres.loading || !data) {
    return <div>loading...</div>
  }

  const books = data.allBooks

  const distinctGenres = new Set()

  genres.data.allBooks.map(item => item.genres.map(genre => distinctGenres.add(genre)))
  const genreArray = [...distinctGenres]

  return (
    <div>
      <h2>books</h2>
      <p></p>
      { genre !== '' ? 
      <div>in genre <em><b>{genre}</b></em>
            <p></p>
      </div>
      : ''
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      { genreArray.map(thisGenre =>        
          <button key={thisGenre} onClick={(event) => handleGenre(event, thisGenre)}>{thisGenre}</button>
      )}
      <button  onClick={(event) => handleGenre(event, '')}>all genres</button>
    </div>
  )
}

export default Books