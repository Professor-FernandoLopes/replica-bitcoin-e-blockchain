class TransactionPool {
    constructor() {
      this.transactions = [];
    }
  
    updateOrAddTransaction(transaction) {
      // verifica se a transação já existe no pool. Lembre-se que da aula sobre transaction updates
      
      let transactionWithId = this.transactions.find(t => t.id === transaction.id);
      if (transactionWithId) {
        this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
      
      // caso contrário insira-a como nova transação.
      } else {
        this.transactions.push(transaction);
      }
    } 

    existingTransaction(address) {
      return this.transactions.find(transaction => transaction.input.address === address);
    }
    
  }
  
  module.exports = TransactionPool;