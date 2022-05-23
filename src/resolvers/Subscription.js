function newLinkSubscribe(parent, args, context, info) {
  //データは直接返さない。
  //GraphQLサーバーにおいてイベントデータをクライアントにpushするときは、asyncIteratorを挟んで返す。
  return context.pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  //ただのJSオブジェクトとして返す。
  newLink,
};
