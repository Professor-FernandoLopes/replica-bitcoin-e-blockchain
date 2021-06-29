  const ChainUtil = require('../chain-util');
  const {INITIAL_BALANCE} = require("../config");
  const Transaction = require('./transaction');
  
  class Wallet {
  constructor() {
  this.balance = INITIAL_BALANCE;
  this.keyPair = ChainUtil.genKeyPair();
  this.publicKey = this.keyPair.getPublic().encode("hex");

 }

 // wallet
 // criar transações 
 // armazenar transações pool 
 // p2p
 // validar mining

  toString() {
  return `Wallet -
  publicKey: ${this.publicKey.toString()} 
  balance: ${this.balance}
`
}

  sign(dataHash) {
  return this.keyPair.sign(dataHash);

} 

// cria transação para o pool para ser posteriormente confirmada no processo de mining
createTransaction(recipient, amount, transactionPool) {
   // this.balance = this.calculateBalance(blockchain);

   // verifica se há saldo para transação
   if (amount > this.balance) {
      console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
      return;
    }

    // se a transação já existe, então devemos atualizá-la, caso contrário adiciona nova transação
    let transaction = transactionPool.existingTransaction(this.publicKey);
  
    if (transaction) {
      transaction.update(this, recipient, amount);
   
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

}

module.exports = Wallet; 