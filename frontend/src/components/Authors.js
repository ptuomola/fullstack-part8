import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'

export const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    born
    bookCount
  }
}
`

export const EDIT_YEAR = gql`
mutation editYear($name: String!, $year: Int!) {
  editAuthor(
    name: $name, 
    setBornTo: $year
  ) {
    name
    born
  }
}
`


const Authors = (props) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [editYear] = useMutation(EDIT_YEAR, {
    onError: props.handleError,
    refetchQueries: [{ query: ALL_AUTHORS}]
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }


  const submit = async (e) => {
    e.preventDefault()

    await editYear({
      variables: { name, year }
    })

    setName('')
    setYear('')
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p></p>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        name <input value={name} onChange={({ target }) => setName(target.value)}/><br/>
        born <input value={year} onChange={({ target }) => setYear(parseInt(target.value))}/><br/>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors