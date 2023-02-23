## Create a simple private network locally(ETH):

following: https://geth.ethereum.org/docs/fundamentals/private-network

1. Create as many nodes as you want:

  > mkdir node<node_id> node2<node_id+1>

  Example:

  > mkdir node1 node2

2. Create an account for each node:

  Need to run this command for each folder you create on the previous step. This will ask for a password which you will have to remember on the next steps.

  > geth --datadir node<node_id> account new

  This will return an output like this:

  Public address of the key:   <address>
  Path of the secret key file: <location_of_secret_key>

3. Add a password.txt file to each node folder with the password written in there.

4. Change the genesis template file given to include the addresses(without the 0x) of the nodes created and how much ETH they will have on their accounts:

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

INFO:

node1
Public address of the key:   0x9E1F273666909C7E0dE6e84717Baed0da72af507
Path of the secret key file: node1/keystore/UTC--2023-02-23T15-31-18.898484000Z--9e1f273666909c7e0de6e84717baed0da72af507

node2
Public address of the key:   0x77647382DbDF2F68aDcee4995d4c2F5640C742ad
Path of the secret key file: node2/keystore/UTC--2023-02-23T15-31-28.518306000Z--77647382dbdf2f68adcee4995d4c2f5640c742ad

START THE NODES:

bootnode -nodekey boot.key -addr :30305

geth --datadir node1 --port 30307 --bootnodes "enode://bcc4d5591bad591b86705366ccb008ec3c309dfa1de1436139f66533845e80ed00eb32c99838a279fa53c556dbff29093ef1da171ffd33a02a80f040fc2389ea@127.0.0.1:0?discport=30305"  --networkid 123454321 --unlock 0xeB255f9ac33EF76A686d28b8e150dB6c5c37ACa5 --password node1/password.txt --authrpc.port 8551 --gasprice '1' --mine console

geth --datadir node2 --port 30308 --bootnodes "enode://bcc4d5591bad591b86705366ccb008ec3c309dfa1de1436139f66533845e80ed00eb32c99838a279fa53c556dbff29093ef1da171ffd33a02a80f040fc2389ea@127.0.0.1:0?discport=30305"  --networkid 123454321 --unlock 0x16F28CdaE086163e9DF97bF48A8013972987250f --password node2/password.txt --authrpc.port 8552 --gasprice '1' --mine console

LAUNCH THE JAVASCRIPT CONSOLE:

geth attach node1/geth.ipc

net.peerCount
eth.getBalance('0x6b1Eb8693A7157092E3faB3eDb24470335Fd0E17');

get balance for current account:
eth.getBalance(eth.accounts[0])

web3.eth.estimateGas({ from: '0xeB255f9ac33EF76A686d28b8e150dB6c5c37ACa5', to: '0x16F28CdaE086163e9DF97bF48A8013972987250f' , value: 1, gasPrice: 1000 })

eth.getBlock('latest')

web3.eth.estimateGas(})
web3.eth.gasPrice
clique.getSnapshot()
