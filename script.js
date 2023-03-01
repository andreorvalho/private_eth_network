const readlineSync = require('readline-sync');
const execSync = require('child_process').execSync;
const fs = require('fs');
// try {

// } catch (e) {
//   console.error(e);
//   process.exit(1);
// }

numberOfNodes = readlineSync.question('How many nodes do you want to create?');
var addresses = [];
for (; numberOfNodes > 0 ; numberOfNodes--) {
  execSync(`mkdir node${numberOfNodes}`, { encoding: 'utf-8' });
  execSync(`echo "12345" | tee node${numberOfNodes}/password.txt`, { encoding: 'utf-8' });
  output = execSync(`geth --datadir node${numberOfNodes} account new --password node${numberOfNodes}/password.txt | grep 0x`, { encoding: 'utf-8' });
  const splittedOutput = output.split(' ');
  const result = splittedOutput.filter(element => element.startsWith('0x'));
  addresses.push(result[0]);

  //execSync(``, { encoding: 'utf-8' });
  //"D4a7fE57166EfD04639cA7cdba1f0623caa9223F": { "balance": "40000000" }
  //0x0000000000000000000000000000000000000000000000000000000000000000
  //612254c1125C1E662e6219dd52A140bE2586F56C
  //0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
}
execSync(`cp genesis.json.template genesis.json`, { encoding: 'utf-8' });
var data = JSON.parse(fs.readFileSync(`${process.cwd()}/genesis.json`));
addresses.array.forEach(address => {
  data.alloc[address] = { "balance": "100000000" }
});


