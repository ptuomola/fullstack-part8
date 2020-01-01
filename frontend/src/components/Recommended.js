import React from 'react'
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks'

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


const Recommended = (props) => {
const [getBooks, { called, loading, data }]  = useLazyQuery(ALL_BOOKS, {
      fetchPolicy: "network-only"
    });

  if (!props.show) {
    return null
  }

  if(!props.user)
  {
    return <div>not logged in</div>
  }

  if(!called)
  {
    getBooks({ variables: { genre: props.user.favoriteGenre } })
    return null
  }

  if (loading || !data) {
    return <div>loading...</div>
  }

  const books = data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <p></p>
      books in your favorite genre <em><b>{props.user.favoriteGenre}</b></em>
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
    </div>
  )
}

export default Recommended