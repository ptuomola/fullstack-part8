import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

export const ALL_BOOKS = gql`
query getBooks($genre: String)
{
  allBooks(genre: $genre)  {
    title
    author {
      name
    }
    published
  }
}
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

  if(!called)
  {
    getBooks()
    return null
  }

  const handleGenre = (event, newGenre) => {
    if(newGenre === '')
      getBooks()
    else
    {
      console.log('getting with', newGenre)
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

  console.log(genres)
  genres.data.allBooks.map(item => item.genres.map(genre => distinctGenres.add(genre)))
  const genreArray = [...distinctGenres]

  return (
    <div>
      <h2>books</h2>

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