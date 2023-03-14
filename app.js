var Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:8545');
web3.eth.getAccounts().then(accounts => {
  account1 = accounts[0].toLowerCase();

  web3.eth.personal.unlockAccount(account1, "12345", 15000).then( unlockStatus => {
    console.log("Account: " + account1 + "is unlocked: " + unlockStatus);
    web3.eth.getBalance(account1).then(a => console.log(a));
    // web3.eth.sendTransaction({ from: account1, to: '0xd871803ba61ed24c6dff76e5888fe83ca37aac74' , value: 1, gasPrice: 1000, data: '0x616e647265' },
    // function(err, transactionHash) {
    //  if (err) {
    //   console.log("Dummy transaction error:", err);
    //  }
    //  console.log('hello');
    //  console.log(transactionHash);
    //  return;
    // });


 });
});

