
class Miner {
constructor(blockchain, transactionPool,wallet, p2pServer) {

this.blockchain = blockchain;
this.transactionPool= transactionPool;
this.wallet= wallet;
this.p2pServer = p2pServer;

}

// pega transações do pool de transações
// coloca essas transações em um bloco cujos dados serão essas transações
/*fala para o p2p server sincronizar as chains, incluindo este novo bloco com suas respectivas 
transações
*/
// finalmente fala para o pool de transações eliminar as transações incluídas no bloco.
mine() {
const validTransactions = this.transactionPool.validTransactions()
// include a reward for the miner
// create a block consisting of valid transactions
// syncronize the chains in the peer to peer server
// clear this transaction pool 
// broadcast to every miner to clear their transaction pool
}

}

module.exports= Miner;