const { ApolloServer } = require("apollo-server");
//スキーマを別ファイルに移動するため
const fs = require("fs");
const path = require("path");

//HackerNewsの１つ１つの投稿
//だがこれだけだとメモリ内にしかデータが保存できない
//Mutation実装後、Prismaでデータベース追加する
let links = [
  {
    id: "link-0",
    description: "GraphQLチュートリアルをUdemyで学ぶ",
    url: "www.howtographql.com",
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
const resolvers = {
  //typeDefsで定義したQueryに対するリゾルバ
  Query: {
    info: () => "HackerNewsクローン",
    // info: () => null, //typeDefsと違う型だと型エラーが出る。
    feed: () => links,
  },

  //typeDefsで定義したLinkの投稿用リゾルバ
  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;

      const link = {
        //投稿する度にidのカウントを上げる
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);
      return link;
    },
  },

  //typeDefsで定義したLinkに対するリゾルバ
  //これは記述しなくても良い
  //   Link: {
  //     id: (parent) => parent.id,
  //     description: (parent) => parent.description,
  //     url: (parent) => parent.url,
  //   },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーが起動中・・・`));
