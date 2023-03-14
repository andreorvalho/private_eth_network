# Create a simple private network locally(ETH):

## To start the app:

Node version - v18.12.1
I recommend to use nvm and you can use brew to install it: https://formulae.brew.sh/formula/nvm

1. install node and npm:
if using nvm you can just do `nvm use` or if you dont have that version of node installed `nvm install v18.12.1`
2. run npm install to install all dependencies
3. node script.js and follow the steps. This will already start your bootnode(You can read more about it on step 7 on the step by step guide)
4. Then you need to start the nodes by hand(Step 8 on the step by step guide)
5. If you want to restart it I recommend usin the deletion script `node deletion-script.js`

## Sources:

https://geth.ethereum.org/docs/fundamentals/private-network
https://medium.com/coinmonks/setup-geth-ethereum-private-network-3806ef7fbe42
https://medium.com/hackernoon/setup-your-own-private-proof-of-authority-ethereum-network-with-geth-9a0a3750cda8

## Step by step guide:

1. Create as many nodes as you want:

  We create seperate folders to be easier to start the nodes separately as you need a data directory for each one when starting geth

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

3. Add a password.txt file to each node folder with the password written in there to help start geth

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

5. Create a copy of the genesis.json file for each node folder

6. Setup the nodes with the init command

  > geth init --datadir <nodes_folder> <path_to_genesis_file>

  Example:

  > geth init --datadir node1 node1/genesis.json

7. Configure a boot node using the bootnode developer tool, this will help nodes find peers in the network:

  ```
  # first create a key for the boot node
  bootnode -genkey boot.key
  # Then create and start the bootnode you can add a & at the end to start the process in the background
  bootnode -nodekey boot.key -addr :30305
  # if you start the process in the background you can check the node address with this command:
  bootnode -nodekey boot.key -addr :30305 --writeaddress
  ```

8. Start the nodes individually:

  Here you can use RPC which will allow the nodes to discover each other and also access a console

  ```
  # data_directory - directory where the data of the blockchain for this node will be kept
  # node_port - Needs to be a different one per node including the bootnode, example: 30306.On a real network (one node per machine), use the same port.
  # bootnode_address - This is the address returned by the bootnode command on step 7, example: enode://482f9fbfa9e065cb21d5917e2dbc4e53a182555ccedcab11f2e482233110a3611ece3472911f3b9516488b5ee317592cf96254ca105f3db8ad8d85109e5527b3@127.0.0.1:0?discport=30305
  # network_id - This is the value of chainId inside the config on your genesis block file
  # node_address - The nodes address from step 2, example: 0x22d10957a8D0A7Ebe6fB89AF0D853a3de86E0D41
  # password_file_path - the path to the password file created on step 3
  # authrpc_port - Needs to be different per node, example: 8551

  geth --datadir <data_directory> --port <node_port> --bootnodes <bootnode_address>  --networkid <network_id> --unlock <node_address> --password <password_file_path> --authrpc.port <authrpc_port>
  ```

  Example:

  geth --datadir node1 --port 30307 --bootnodes "enode://482f9fbfa9e065cb21d5917e2dbc4e53a182555ccedcab11f2e482233110a3611ece3472911f3b9516488b5ee317592cf96254ca105f3db8ad8d85109e5527b3@127.0.0.1:0?discport=30305" --networkid 12345 --unlock 0x742faffe4e2885411ca6b9b8c5f68be92e10d25a --password node1/password.txt --authrpc.port 8551

  Or you can start your nodes with http which will allow an easier way to interact with the blockchain via code.

  ```
  # http_address - The http address to use when accessing the node. locally you can use: 0.0.0.0 which will default to localhost
  # apis_list - The list of api's that will be available on the node through http
  # http_port - the port on which this will be available the http access
  # bootnode_address - This is the address returned by the bootnode command on step 7, example: enode://482f9fbfa9e065cb21d5917e2dbc4e53a182555ccedcab11f2e482233110a3611ece3472911f3b9516488b5ee317592cf96254ca105f3db8ad8d85109e5527b3@127.0.0.1:0?discport=30305
  # network_id - This is the value of chainId inside the config on your genesis block file
  # node_address - The nodes address from step 2, example: 0x22d10957a8D0A7Ebe6fB89AF0D853a3de86E0D41
  # password_file_path - the path to the password file created on step 3
  # authrpc_port - Needs to be different per node, example: 8551

  geth --datadir <data_directory> --port <node_port> --ipcdisable --syncmode full --http --http.addr <http_address> --http.api <apis_list> --allow-insecure-unlock --http.corsdomain "*" --http.vhosts "*" --http.port <http_port> --bootnodes <bootnode_address>  --networkid <network_id> --unlock <node_address> --password <password_file_path> --authrpc.port <authrpc_port>

  Example:

  geth --datadir node3 --port 30309 --ipcdisable --syncmode full --http --http.addr 0.0.0.0 --http.api admin,eth,miner,net,txpool,personal,web3 --allow-insecure-unlock --http.corsdomain "*" --http.vhosts "*" --http.port 8546 --bootnodes "enode://12fe081006ae40d11eb40b989a8fc1f50ae2b5ba90950397f55e491e7583fbba88871a99903a93be5b39560250d77e86c4b976146d5df3ed25a394b8ed0718ab@127.0.0.1:0?discport=30305"  --networkid 12345 --unlock 0xd871803ba61ed24c6dff76e5888fe83ca37aac74 --password node3/password.txt --authrpc.port 8553
  ```

more options:
--mine console starts a console right away so you can mine

# Important commands

## Launch a javascript console:
Start a console when the node is connected to the RPC:
  - geth attach <datadir>/geth.ipc || example: geth attach node1/geth.ipc
Start a console when the node is connected to HTTP:
geth attach http://<http_address>:<http_port> || example: geth attach http://127.0.0.1:8546

## commands for the console
- How many peers are on my network:
net.peerCount
- Get balance for current account:
web3.eth.getBalance(eth.accounts[0])
- Get balance for another account:
web3.eth.getBalance('<address>'); || example: web3.eth.getBalance('0x90458dc574f0a62228d3d2ff068f95e5f931d19b')
- Send a transaction:
web3.eth.sendTransaction({ from: eth.accounts[0], to: '0x8acc46e9f5a5f23519b3682567fffdef9e21dc31' , value: 1, gasPrice: 1000, data: '0x616e647265' })
- Check gas for transaction:
web3.eth.estimateGas({ from: eth.accounts[0], to: '0x90Af074EB5399C00587C5ef742CEc027aE77d9dF' , value: 1, gasPrice: 1000 })
- Check a transaction:
web3.eth.getTransaction('<transaction_id>') - this id is returned by `sendTransaction`
eth.getTransaction("0x03b759fe11c104f8aad972ed2337e0f2e7f6c6bf26138badcbbf55801f643303")
- Start mining:
miner.start() - this only works from the sealing node
- Stop mining:
miner.stop()
- Information about network:
last block: eth.getBlock('latest')
whole network state: clique.getSnapshot()
gas price: web3.eth.gasPrice
