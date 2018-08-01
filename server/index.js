const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '/../protos/chat.proto');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync(
    PROTO_PATH,
    options
  )
);

const users = [];
let username;

const join = (call) => {
  users.push(call);
  notifyChat(
    {
      user: "server",
      text: `${username} joined the chat`
    }
  )
}

const send = (call, callback) => {
  notifyChat(call.request);
}

const notifyChat = (message) => {
  users.forEach(user => {
    user.write(message);
  });
}

const user = (call) => {
  username = call.request.username;
}

const main = () => {
  const server = new grpc.Server();
  const PORT = 3000;
  server.addService(proto.app.Chat.service,
                    {
                      join: join,
                      send: send,
                      user: user
                    }
                  );
  server.bind(`localhost:${PORT}`, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log(`Connect to server on PORT: ${PORT}`);
}

main();
