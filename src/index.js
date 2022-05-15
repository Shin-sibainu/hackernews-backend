const { ApolloServer } = require("apollo-server");
//スキーマを別ファイルに移動するため
const fs = require("fs");
const path = require("path");

//Prismaクライアントを利用してリゾルバ関数を更新する。
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

//作ってきたリゾルバたちを呼び出す
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

const prisma = new PrismaClient();

//HackerNewsの１つ１つの投稿
//だがこれだけだとメモリ内にしかデータが保存できない
//Mutation実装後、Prismaでデータベース追加する
let links = [
  {
    id: "link-0",
    description: "GraphQLチュートリアルをUdemyで学ぶ",
    url: "www.udemy-graphql-tutorial.com",
  },
];

//GraphQLスキーマの定義
// const typeDefs = `
//     type Query {
//         info: String!
//         feed: [Link]!
//     }

//     type Mutation {
//         post(url: String!, description: String!): Link!
//     }

//     type Link {
//         id: ID!
//         description: String!
//         url: String!
//     }
// `;

//上で定義したクエリはリゾルバ関数で呼び出せる。
// const resolvers = {
//   //typeDefsで定義したQueryに対するリゾルバ
//   Query: {
//     info: () => "HackerNewsクローン",
//     // info: () => null, //typeDefsと違う型だと型エラーが出る。
//     // feed: () => links,
//     //ここからはPrismaでデータベース管理
//     feed: async (parent, args, context) => {
//       return context.prisma.link.findMany();
//     },
//   },

//   //typeDefsで定義したLinkの投稿用リゾルバ
//   Mutation: {
//     // post: (parent, args) => {
//     //   let idCount = links.length;
//     //   const link = {
//     //     //投稿する度にidのカウントを上げる
//     //     id: `link-${idCount++}`,
//     //     description: args.description,
//     //     url: args.url,
//     //   };
//     //   links.push(link);
//     //   return link;
//     // },
//     //これでデータベースに永続的に保存できる。
//     post: (parent, args, context, info) => {
//       const newLink = context.prisma.link.create({
//         data: {
//           url: args.url,
//           description: args.description,
//         },
//       });
//       return newLink;
//     },
//   },

//   //typeDefsで定義したLinkに対するリゾルバ
//   //これは記述しなくても良い
//   //   Link: {
//   //     id: (parent) => parent.id,
//   //     description: (parent) => parent.description,
//   //     url: (parent) => parent.url,
//   //   },
// };

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,

  //特定の操作のために実行されるすべてのリゾルバに渡されるオブジェクト
  //これにより、リゾルバはデータベース接続のような有用なコンテキストを共有することができます。
  //どこでも使えるよ～って感じ。
  // context: {
  //   prisma,
  // },
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーが起動中・・・`));
