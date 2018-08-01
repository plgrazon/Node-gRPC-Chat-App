const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const readline = require('readline');

const PROTO_PATH = path.join(__dirname, '/../protos/chat.proto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

let username;

const PORT = 3000;
const client = new proto.app.Chat(
  `localhost:${PORT}`,
  grpc.credentials.createInsecure()
);

const main = () => {

  client.user({username: username}, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log('who ', res.username)
  });

  const stream = (chunk) => {
    if (chunk.user === username) {
      return;
    }
    console.log(`${chunk.user}: ${chunk.text}`);
  }

  let channel = client.join({user: username});

  channel.on('data', stream);

  rl.on('line', text => {
    client.send({ user: username, text: text }, res => {});
  });
}

rl.question('What\'s your name? ', (input) => {
  username = input;

  main();
});
