const readlineSync = require('readline-sync');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const fs = require('fs');

execSync('bootnode -genkey boot.key', { encoding: 'utf-8' });

numberOfNodes = readlineSync.question('How many nodes do you want to create?');
var addresses = {};
for (var nodeNumber = numberOfNodes; nodeNumber > 0 ; nodeNumber--) {
  execSync(`mkdir node${nodeNumber}`, { encoding: 'utf-8' });
  execSync(`echo "12345" | tee node${nodeNumber}/password.txt`, { encoding: 'utf-8' });
}

for (var nodeNumber = numberOfNodes; nodeNumber > 0 ; nodeNumber--) {
  output = execSync(`geth --datadir node${nodeNumber} account new --password node${nodeNumber}/password.txt | grep 0x`, { encoding: 'utf-8' });
  const splittedOutput = output.split(' ');
  const result = splittedOutput.filter(element => element.startsWith('0x'));
  addresses[`node${nodeNumber}`] = result[0].toLowerCase().replace(/\n/g, '');
}

var data = JSON.parse(fs.readFileSync(`${process.cwd()}/genesis.json.template`));
Object.values(addresses).forEach((address) => {
  data.alloc[address] = { "balance": "100000000000000000000000000" }
});
const extraDataStart = "0x0000000000000000000000000000000000000000000000000000000000000000";
const extraDataFinish = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

data.extradata = extraDataStart + Object.values(addresses).map(address => address.replace('0x', '')).join('') + extraDataFinish

for (var nodeNumber = numberOfNodes; nodeNumber > 0 ; nodeNumber--) {
  fs.writeFileSync(`./node${nodeNumber}/genesis.json`, JSON.stringify(data, null, 2) , 'utf-8');
  execSync(`geth init --datadir node${nodeNumber} node${nodeNumber}/genesis.json`, { encoding: 'utf-8' });
}

const bootNodeAddress = execSync('bootnode -nodekey boot.key -addr :30305 --writeaddress').toString().replace(/\n/g, '');
console.log("bootNodeAddress: " + bootNodeAddress);

exec('bootnode -nodekey boot.key -addr :30305 &');
console.log("bootnode up");

var port = "30307";
var authrpcPort = "8551";
var httpPort = "8545"

Object.keys(addresses).forEach((name) => {
  console.log(`geth --datadir ${name} --port ${port} --ipcdisable --syncmode full --http --http.addr 0.0.0.0 --http.api admin,eth,miner,net,txpool,personal,web3 --allow-insecure-unlock --http.corsdomain "*" --http.vhosts "*" --http.port ${httpPort} --bootnodes "enode://${bootNodeAddress}@127.0.0.1:0?discport=30305" --networkid 12345 --unlock ${addresses[name]} --password ${name}/password.txt --authrpc.port ${authrpcPort}`);
  // exec(`geth --datadir ${name} --port ${port} --ipcdisable --syncmode full
  //  --http --http.addr 0.0.0.0 --http.api admin,eth,miner,net,txpool,personal,web3
  //  --allow-insecure-unlock --http.corsdomain "*" --http.vhosts "*" --http.port ${httpPort}
  //  --bootnodes "enode://${bootNodeAddress}@127.0.0.1:0?discport=30305"
  //  --networkid 12345 --unlock ${addresses[name]} --password ${name}/password.txt
  //  --authrpc.port ${authrpcPort}`);
  port++;
  authrpcPort++;
  httpPort++;
});

//console.log("all nodes up");
