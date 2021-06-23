const Websocket = require('ws');

// ou escuta na porta indicada pelo usuário ou na 5001
const P2P_PORT = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

// usado para verificar o tipo de mensagem enviada.
const MESSAGE_TYPES = {
chain: "CHAIN",
transaction:"TRANSACTION"
};

// a classe p2pServer é composta dos elementos necessários para uma rede blockchain
// os nós(sockets), a estrutura de dados blockchain, e o pool de transações.
class P2pServer {
  constructor(blockchain,transactionPool) {
    this.transactionPool = transactionPool;
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    // cria um servidor Websocket na porta indicada.
    const server = new Websocket.Server({ port: P2P_PORT });

    // aguarda a conexão e conecta os sockets(nós)
    server.on('connection', socket => this.connectSocket(socket));
    // chama a função abaixo
    this.connectToPeers();
                                    // está esperando conexão na porta 5001
    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }
  
  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    // inclui o nó(socket) no array de nós
    this.sockets.push(socket);
    console.log('Socket connected');
    
    // passa o nó para o messageHandler
    this.messageHandler(socket);
    
    this.sendChain(socket)
  }
// sincronize chains and keep the transaction pool updated
// analisa se a mensagem recebida é uma blockchain ou uma transação.
// se for blockchain chama a função replace chain
// se for transação chama a função updateOrAddTransaction
messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      
      switch(data.type) {
        
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
          
          case MESSAGE_TYPES.transaction:
            this.transactionPool.updateOrAddTransaction(data.transaction);
            break;
      }
    });
  }

  // envia a blockchain
  sendChain(socket) {
    socket.send(JSON.stringify({
     type:MESSAGE_TYPES.chain,  
     chain: this.blockchain.chain}));
  }
 // envia transação
  sendTransaction(socket,transaction) {
    socket.send(JSON.stringify(
      { type:MESSAGE_TYPES.transaction,
        transaction:transaction}));
  }

  // faz com que cada nó rode a mesma blockchain
  syncChains() {
   this.sockets.forEach(socket => this.sendChain(socket));
    };
  
  // faz com que cada nó esteja atualizado em relação ao mesmo pool de transação.
  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

}

module.exports = P2pServer;