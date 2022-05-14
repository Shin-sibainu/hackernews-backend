const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
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
