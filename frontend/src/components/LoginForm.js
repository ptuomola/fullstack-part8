import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(
    username: $username,
    password: $password
  ) {
    value
  }
}
`



const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onError: props.handleError,
  })

  if (!props.show) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()

    const response = await login({
      variables: { username, password }
    })

    if(response)
    {
      const token = response.data.login.value;
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
      props.setPage('authors')
    }

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm