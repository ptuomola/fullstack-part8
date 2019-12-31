const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')

mongoose.set('useFindAndModify', false)

const MONGODB_URI = "mongodb+srv://fullstack:7Ka4ZtwBE2shlWKr@cluster0-xni7a.mongodb.net/library?retryWrites=true&w=majority"

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    id: ID
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book,
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    hello: () => { return "world" },
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      return Book.find({})
/*
      if(!args.author && !args.genre) 
        return books

      retval = books
      if(args.author)
        retval = retval.filter(book => book.author === args.author)

      if(args.genre)
        retval = retval.filter(book => book.genres.includes(args.genre)) 
      
      return retval
*/
    },
    allAuthors: () => Author.find({})
  },
  Author: {
    /*
    bookCount: (root) => {
      return books.filter((book) => book.author === root.name).length
    }*/
  },
  Book: {
    author: (root) => {
      console.log('doing lookup with ', root)
      return Author.findById(root.author)
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({...args})

      var author = await Author.findOne({ name: args.author })
      if(author === null) {
        author = new Author({ name: args.author })
        author.save()
      }

      book.author = author
      return book.save()
    },
    editAuthor: (root, args) => {
      const author = authors.find(author => author.name === args.name)
      console.log('author found', author)

      if(typeof author === 'undefined') 
        return null

      const updatedAuthor = {  ...author, born: args.setBornTo }
      console.log('updated author', updatedAuthor)

      authors = authors.map(author => author.name === args.name ? updatedAuthor : author)
      return updatedAuthor
    }
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})