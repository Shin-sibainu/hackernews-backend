//誰によって投稿されたか、リゾルバ
function postedBy(parent, args, context) {
  return context.prisma.link
    .findUnique({ where: { id: parent.id } }) //親はUserスキーマだからUserIDで１人だけ見つける。
    .postedBy();
}

module.exports = {
  postedBy,
};
