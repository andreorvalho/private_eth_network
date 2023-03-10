## Create a simple private network locally(ETH):

following: https://geth.ethereum.org/docs/fundamentals/private-network

1. Create as many nodes as you want:

  > mkdir node<node_id> node2<node_id+1>

  Example:

  > mkdir node1 node2

2. Create an account for each node:

  Need to run this command for each folder you create on the previous step. This will ask for a password which you will have to remember on the next steps.

  > geth --datadir node<node_id> account new
  > geth --datadir node1 account new --password node1/password.txt

  This will return an output like this:

  Public address of the key:   <address>
  Path of the secret key file: <location_of_secret_key>

3. Add a password.txt file to each node folder with the password written in there.

4. Change the genesis template file:

  include the addresses(without the 0x) of the nodes created and how much ETH they will have on their accounts on the alloc field:

  ```
  "alloc": {
      "<address_node_1>": { "balance": "300000" },
      "<address_node_2>": { "balance": "400000" }
    }
  ```
  Example:
    nodes addresses are 0x22d10957a8D0A7Ebe6fB89AF0D853a3de86E0D41 and 0x4f3da1CB3ebDAA7032d09f018939b50927387d02

  ```
  "alloc": {
      "22d10957a8D0A7Ebe6fB89AF0D853a3de86E0D41": { "balance": "300000" },
      "4f3da1CB3ebDAA7032d09f018939b50927387d02": { "balance": "400000" }
    }
  ```

  Also one of the nodes needs to be a sealer and its address needs to be added to the extra data field with zeros before and after it:

  ```
  "extradata": "0x<64 zeros><address><130 zeros>"
  ```

  ```
  "extradata": "0x000000000000000000000000000000000000000000000000000000000000000022d10957a8D0A7Ebe6fB89AF0D853a3de86E0D410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  ```

  p.s. we can create the genesis block with the `puppeth` command

5. In each node folder create a copy of the genesis.json file

6. Setup the nodes with the init command

  > geth init --datadir <nodes_folder> <path_to_genesis_file>

  Example:

  > geth init --datadir node1 node1/genesis.json

7. Configure a boot node using the bootnode developer tool:

  ```
  # first create a key for the boot node
  bootnode -genkey boot.key
  # Then create and start the bootnode
  bootnode -nodekey boot.key -addr :30305
  ```

8. Start the nodes individually:

  ```
  # node_port - Needs to be a different one per node including the bootnode, example: 30306
  # bootnode_address - This is returned by command above, example: enode://482f9fbfa9e065cb21d5917e2dbc4e53a182555ccedcab11f2e482233110a3611ece3472911f3b9516488b5ee317592cf96254ca105f3db8ad8d85109e5527b3@127.0.0.1:0?discport=30305
  # node_address - The nodes address from step 2, example: 0x22d10957a8D0A7Ebe6fB89AF0D853a3de86E0D41
  # authrpc_port - Needs to be different per node, example: 8551

  geth --datadir node1 --port <node_port> --bootnodes <bootnode_address>  --networkid 123454321 --unlock <node_address> --password <password_file_path> --authrpc.port <authrpc_port>
  ```

START THE NODES:

bootnode -nodekey boot.key -verbosity 9 -addr :30305

geth --datadir node1/ --syncmode 'full' --port 30307 --authrpc.addr localhost --authrpc.port 8551 --authrpc.vhosts localhost --http.api admin,eth,miner,net,txpool,personal,w --bootnodes 'enode://412e1307d069873b71648a511e52be5d237a5c3c85a7d2dd0b53431c5224c232849c812fe84ba07610c3b2352004c195dfbf62c4d40c140a65374e1b73fceeb2@127.0.0.1:30310' --networkid 12345  -unlock '0xf9f13a5cb05b1fb4e5ce53dc7d54cdc16bdeffb0' --password node1/password.txt --mine

geth --datadir node2/ --syncmode 'full' --port 30308 --authrpc.addr localhost --authrpc.port 8552 --authrpc.vhosts localhost --http.api admin,eth,miner,net,txpool,personal,w --bootnodes 'enode://412e1307d069873b71648a511e52be5d237a5c3c85a7d2dd0b53431c5224c232849c812fe84ba07610c3b2352004c195dfbf62c4d40c140a65374e1b73fceeb2@127.0.0.1:30310' --networkid 12345 -unlock '0xcaa6bd6fecbbec231292b87c73b1e181262f3923' --password node2/password.txt

geth --datadir node1 --port 30307 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 12345 --unlock 0x742faffe4e2885411ca6b9b8c5f68be92e10d25a --password node1/password.txt --authrpc.port 8551

geth --datadir node2 --port 30308 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 12345 --unlock 0x90458dc574f0a62228d3d2ff068f95e5f931d19b --password node2/password.txt --authrpc.port 8552

geth --datadir node3 --port 30309 --ipcdisable --syncmode full --http --http.addr 0.0.0.0 --http.api admin,eth,miner,net,txpool,personal,web3 --allow-insecure-unlock --http.corsdomain "*" --http.vhosts "*" --http.port 8546 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 12345 --unlock 0xd871803ba61ed24c6dff76e5888fe83ca37aac74 --password node3/password.txt --authrpc.port 8553

geth --datadir node3 --port 30309 --ipcdisable --syncmode full --http --http.addr 0.0.0.0 --http.api admin,eth,miner,net,txpool,personal,web3 --allow-insecure-unlock --http.corsdomain "*" --http.vhosts "*" --http.port 8545 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 1234 --unlock 0x0103dcadccbe9c01239aa41758b69a8d1b1644ef --password nodes/password.txt

geth --datadir nodes --port 30307 --bootnodes "enode://961ed75382a06264a9eccae558dd59b5ebce84beef02700225f92f69672f1730b0599635ddbaff52b2ccd5ff2bf4ca89b520a77871490fd8963b09891b42180f@127.0.0.1:0?discport=30305" --networkid 123454321 --unlock 0x3df09f16ab0a17759f2a1e61d5bc4d499f790163 --password nodes/password.txt --authrpc.port 8551 --http.api "eth,net,web3,personal,miner"

more options:
 --gasprice '1' --mine console

- LAUNCH THE JAVASCRIPT CONSOLE:
geth attach node1/geth.ipc
geth attach http://127.0.0.1:8545

- How many peers are on my network:
net.peerCount

- Get balance for current account:
eth.getBalance(eth.accounts[0])
- Get balance for another account:
eth.getBalance('<address>');
- Send a transaction:
eth.sendTransaction({ from: eth.accounts[0], to: '0xd871803ba61ed24c6dff76e5888fe83ca37aac74' , value: 1, gasPrice: 1000, data: '0x616e647265' })
check gas for transaction: web3.eth.estimateGas({ from: eth.accounts[0], to: '0x90Af074EB5399C00587C5ef742CEc027aE77d9dF' , value: 1, gasPrice: 1000 })
- Start mining:
miner.start()
- Stop mining:
miner.stop()
- Information about network:
last block: eth.getBlock('latest')
whole network state: clique.getSnapshot()
gas price: web3.eth.gasPrice

pupeth --network=andre

0x3057a9d4f8d410293d4b4766b4b1c82c242fe3f6ecb2c114701b723ddb24312e

eth.getTransaction("0x6f1370512787ae964206935a628b0d73bea1a39db879cdc7fb57320719da507c")

working:

geth --datadir node1 --port 30307 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 12345 --unlock 0x742faffe4e2885411ca6b9b8c5f68be92e10d25a --password node1/password.txt --authrpc.port 8551

geth --datadir node2 --port 30308 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 12345 --unlock 0x90458dc574f0a62228d3d2ff068f95e5f931d19b --password node2/password.txt --authrpc.port 8552

geth --datadir node3 --port 30309 --ipcdisable --syncmode full --http --http.addr 0.0.0.0 --http.api admin,eth,miner,net,txpool,personal,web3 --allow-insecure-unlock --http.corsdomain "*" --http.vhosts "*" --http.port 8546 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 12345 --unlock 0xd871803ba61ed24c6dff76e5888fe83ca37aac74 --password node3/password.txt --authrpc.port 8553
