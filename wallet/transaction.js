
// transactions will be objects which will represent exchanges in our criptocurrency
// they will consist of three primary components.
const ChainUtil = require('../chain-util');

// elementos da transação
class Transaction {
constructor() {
// id virá do método id que está no arquivo chain-utill classe ChainUtil que aplica o uuid
this.id = ChainUtil.id();
this.input = null;

// outputs: valor enviado de Alice para Bob e outro de Alice para Alice
this.outputs = [];

}

update(senderWallet, recipient, amount) {
	const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

  if (amount > senderOutput.amount) {
    console.log(`Amount: ${amount} exceeds balance.`);
    return;
  }

  senderOutput.amount = senderOutput.amount - amount;
  
  this.outputs.push({ amount, address: recipient });
  Transaction.signTransaction(this, senderWallet);

  return this; 
}

// instancia a transação com o uso de new this()
// recebe o endereço do remetente, do destinatário e quantidade para o destinatário
static newTransaction(senderWallet, recipient, amount) {
const transaction = new this();
// verifica se o valor a ser enviado não é maior do que o saldo disponível.
if(amount > senderWallet.balance) {

    console.log(`Amount ${amount} exceeds balance`);
    return;
}

transaction.outputs.push(...[
  // valor do saldo disponível alice após descontar o saldo a ser enviado para bob.
  { amount: senderWallet.balance - amount, 
   
    // endereço do remetente
    address: senderWallet.publicKey},

    // quantia a ser enviada de alice para Bob.
  { amount:amount, 
  
    // endereço de Bob.
    address: recipient}  ])

Transaction.signTransaction(transaction,senderWallet);
  
return transaction;
}

// assina a transação

 static signTransaction(transaction, senderWallet){
 
 // input da transação.
 transaction.input = {
 // data
 timestamp: Date.now(),
 // saldo do remetente
 amount: senderWallet.balance,

 // endereço do remetente
 address: senderWallet.publicKey,

// assinatura do remetente sobre o hash dos outputs
 signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))

}   

}
// verifica a assinatura da transação 
static verifyTransaction(transaction){
  // usa o método para verificar a assinatura
  
  return ChainUtil.verifySignature(
  transaction.input.address,
  transaction.input.signature,
  ChainUtil.hash(transaction.outputs)
);
}
}

module.exports=Transaction; 