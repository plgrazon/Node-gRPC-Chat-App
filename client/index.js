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
