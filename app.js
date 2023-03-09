var Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:8545');
web3.eth.getAccounts().then(accounts => {

  account1 = accounts[0].toLowerCase();
  account2 = accounts[1].toLowerCase();
  web3.eth.personal.unlockAccount(account1,"12345", 15000).then( account => {
    console.log(account)
    web3.eth.sendTransaction({ from: account1, to: account2 , value: 1, gasPrice: 1000, data: '0x616e647265' },
    function(err, transactionHash) {
     if (err) {
      console.log("Dummy transaction error:", err);
     }
    });

  //web3.eth.sendTransaction({ from: account1, to: account2 , value: 1, gasPrice: 1000, data: '0x616e647265' });
 });
});



//eth.sendTransaction({ from: eth.accounts[0], to: '0x3a73b3cfeeb7c8885e4d9b100c4ee2dbb2bc094e' , value: 1, gasPrice: 1000, data: 0x616e647265 })
