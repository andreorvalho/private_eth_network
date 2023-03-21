const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3('http://127.0.0.1:8545');
const Web3Utils = require('web3-utils');

const getNode1Adress = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0].toLowerCase();
}

const unlockAccount = async (password) => {
  const node1Address = await getNode1Adress();
  const unlockStatus = await web3.eth.personal.unlockAccount(node1Address, password, 15000)
  if (!unlockStatus) {
    throw new Error('Cannot unlock wallet');
  }
  return node1Address;
}

const makeTransactionTo = async ({ receivingAddress, value = 10000, data = '0x616e647265'}) => {
  const node1Address = await unlockAccount('12345')
  web3.eth.getBalance(node1Address).then(balance => console.log("Balance on account of node1: " + balance));

  const transactionDetails = await web3.eth.sendTransaction(
    {
      from: node1Address,
      to:  receivingAddress,
      value: value,
      gasPrice: 1000,
      data: data
    }
  );
  console.log("Transaction hash: " + transactionDetails.transactionHash);
  console.log("done");
  return transactionDetails.transactionHash;
}

const getTransanction = async (transactionHash) => {
  const transactionDetails = await web3.eth.getTransaction(transactionHash);
  return transactionDetails;
}

console.log("transfers from node1 to node2")

const files = fs.readdirSync(`${process.cwd()}/node2/keystore`);
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/node2/keystore/${files[0]}`));
const node2Address = `0x${data.address}`;

const message = Web3Utils.utf8ToHex("yo wassup");

makeTransactionTo({ node2Address, data: message }).then(transactionHash => {
  getTransanction(transactionHash).then(transactionDetails => {
    console.log("Message on transaction: " + Web3Utils.hexToString(transactionDetails.input));
  });
});
