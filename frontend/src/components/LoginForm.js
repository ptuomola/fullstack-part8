import React, { useState } from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
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

const GET_ME = gql`
{
  me
  {
    username
    favoriteGenre
  }
}
`


const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [getMe, meResult]  = useLazyQuery(GET_ME, {
    fetchPolicy: "network-only"
  });
  const [login] = useMutation(LOGIN, {
    onError: props.handleError,
  })

  if(!meResult.called || meResult.loading)
  {
    props.setUser(null)
  } else if(meResult.data)
  {
    props.setUser(meResult.data.me)
  }

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
      getMe()
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