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
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");

//サブスクリプション実装
//publisher(送信)/Subscriber(受信)
const { PubSub } = require("apollo-server");

const prisma = new PrismaClient();
const pubsub = new PubSub();

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

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,

  //特定の操作のために実行されるすべてのリゾルバに渡されるオブジェクト
  //これにより、リゾルバはデータベース接続のような有用なコンテキストを共有することができます。
  //どこでも使えるよ～って感じ。
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub, //これはサブスクリプションの時に追加
      //認証トークンがないとuserIdを取得できない⇨post投稿できない。
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーが起動中・・・`));
