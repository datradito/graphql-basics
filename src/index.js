import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import uuid from "uuid";

/**
 * Utilizo Yoga en vez de Apollo client
 */

//Demo user & posts data:
const users = [
  {
    id: "1",
    name: "Dani",
    email: "datradito@gmal.com",
    age: 43
  },
  {
    id: "2",
    name: "Giuli",
    email: "giuli@gmal.com"
  },
  {
    id: "3",
    name: "Santi",
    email: "santi@gmal.com",
    age: 8
  }
];

const posts = [
  {
    id: "a1",
    title: "el primerpost",
    body: "este es el texto del body",
    published: true,
    author: "1"
  },
  {
    id: "a2",
    title: "el segundo",
    body: "este es el texto del segundo",
    published: false,
    author: "2"
  },
  {
    id: "a3",
    title: "el tercero",
    body: "esto es una prueba",
    published: true,
    author: "2"
  },
  {
    id: "a4",
    title: "el cuarto",
    body: "esto es una prueba cuatro",
    published: true,
    author: "3"
  }
];

const comments = [
  {
    id: "c1",
    text:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ",
    author: "2",
    post: "a1"
  },
  {
    id: "c2",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consequat massa nec nunc tincidunt, ac dapibus ligula consequat. Praesent ornare id elit quis placerat. In bibendum felis at ipsum fermentum sagittis. Nam vel nunc commodo, sollicitudin justo at, efficitur velit. Curabitur in est vitae tortor varius convallis. Sed condimentum commodo nibh, ut sodales purus faucibus sodales. Suspendisse porta nunc quis risus elementum, a dignissim nisl lacinia. Sed sit amet varius lectus.",
    author: "2",
    post: "a1"
  },
  {
    id: "c3",
    text:
      "Praesent tristique tristique risus, eget convallis turpis consequat vitae. In tempus sem ac justo luctus, non bibendum odio posuere. Sed augue lorem, iaculis dictum lectus at, eleifend iaculis magna. Fusce eu lectus ligula. Integer auctor massa vitae vehicula malesuada. Suspendisse facilisis nulla vel diam pellentesque gravida. Vestibulum suscipit libero vitae mauris malesuada fringilla.",
    author: "3",
    post: "a2"
  },
  {
    id: "c4",
    text:
      "Proin feugiat mi sit amet massa egestas, vestibulum euismod massa dapibus. Nam mollis nec nisl ut ornare. Nulla sed enim euismod, commodo nunc ac, iaculis ex. Aliquam suscipit purus et ante auctor faucibus. Proin malesuada sed nunc a auctor. Integer sit amet suscipit mauris. Donec non vestibulum magna. In tincidunt finibus ultrices. Fusce est tellus, pharetra at odio nec, porttitor molestie quam. Integer eget libero eget dui tincidunt dignissim. Nulla tristique euismod nulla, malesuada aliquam eros euismod ut. Cras vulputate magna vitae lorem finibus, a egestas nunc vehicula.",
    author: "1",
    post: "a3"
  }
];

//Type definitions (schema)
/**
 * CUSTOM DATA TYPES
 * OPERATIONS TO PERFORM (QUERIES)
 */
//miDef(argumens): TipoDevuelto
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comments!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comments!
    }

    input CreateUserInput {
      name: String!, 
      email:String!,
      age: Int
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comments!]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comments!]
    }

    type Comments {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

//Resolvers
/**
 * Funciones para correr las operaciones a realizar
 */
//Un metodo por cada querie
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user => {
        // devuelvo true si el user incluye [includes()] la query
        //si user.name incluye a args.query
        //=> devuelvo el elemento user del array users
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        // const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        // const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        // return isTitleMatch || isBodyMatch
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      }
      return comments.text.toLowerCase().includes(args.query.toLowerCase());
    },

    me() {
      return {
        id: "123098",
        name: "Dani",
        email: "datradito@gmal.com",
        age: 43
      };
    },

    post() {
      return {
        id: "akdsjflakjfd",
        title: "el primerpost",
        body: "este es el texto del boy",
        published: true
      };
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      //Check si el mail ya fue utilizado
      const emailTaken = users.some(user => {
        return user.email === args.data.email;
      });

      if (emailTaken) {
        throw new Error("Email ya utilizado.");
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);
      return user;
    },

    createPost(parent, args, ctx, info) {
      //Compruebo que exista el usuario
      const userExist = users.some(user => user.id === args.author);

      if (!userExist) {
        throw new Error("No existe el usuario.");
      }

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author
      };
      posts.push(post);
      return post;
    },

    createComment(parent, args, ctx, info) {
      //Compruebo que exista el usuario
      const userExist = users.some(user => user.id === args.author);

      const postExist = posts.some(
        post => post.id === args.post && post.published
      );

      if (!userExist) {
        throw new Error("No existe el usuario.");
      }

      if (!postExist) {
        throw new Error("Usuario sin posts");
      }

      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post
      };

      comments.push(comment);
      return comment;
    }
  },

  Post: {
    //metodo para relacionar los type defs
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },

  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comments: {
    //metodo para relacionar los type defs
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});

server.start(() => {
  console.log("Server run");
});
