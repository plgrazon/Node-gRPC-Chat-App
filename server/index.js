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

const join = (call, callback) => {
  users.push(call);
  notifyChat(
    {
      users: "server",
      text: "new user joined"
    }
  )
}

const send = (call, callback) => {
  users.forEach(user => {
    user.write(message);
  });
}

const notifyChat = (notification) => {
  users.forEach(user => {
    user.write(message);
  });
}

const main = () => {
  const server = new grpc.Server();
  const PORT = 8080;
  server.addService(proto.app.Chat.service,
                    {
                      join: join,
                      send: send
                    }
                  );
  server.bind(`localhost:${PORT}`, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log(`Connect to server on PORT: ${PORT}`);
}

main();
