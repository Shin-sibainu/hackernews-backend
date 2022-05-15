//データベースにアクセスするためのクライアントライブラリ
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "GraphQLチュートリアルをUdemyで学ぶ",
      url: "www.udemy-graphql-tutorial.com",
    },
  });
  //最初は空。
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    //接続を閉じる
    prisma.$disconnect;
  });
