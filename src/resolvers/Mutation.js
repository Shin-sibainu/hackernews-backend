const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//APP_SECRETはjwtに署名するために使われる
const { APP_SECRET, getUserId } = require("../utils");

//ユーザー新規登録
async function signup(parent, args, context, info) {
  //パスワードの暗号化
  const password = await bcrypt.hash(args.password, 10);

  //ユーザー新規生成
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  //user.idを使ってtoken化(暗号化)する。
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

//ユーザーログイン
async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("そのようなユーザーは存在しません");
  }

  //入力するパスワードと設定されているパスワードを比較
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("無効なパスワードです");
  }

  //パスワードが正しければ
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

//ニュースを投稿するリゾルバ
async function post(parent, args, context, info) {
  const { userId } = context;

  // return await context.prisma.link.create({
  //   data: {
  //     url: args.url,
  //     description: args.description,
  //     postedBy: { connect: { id: userId } },
  //   },
  // });

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  //送信
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

module.exports = {
  signup,
  login,
  post,
};
