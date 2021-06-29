const express = require('express');
const Blockchain = require("../blockchain")
const path= require('path')
const P2pServer= require("./p2p-server.js")
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001; 

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
// servidor p2p recebe uma instância da blockchain
const p2pServer = new P2pServer(bc,tp);

app.use(express.json())
app.use(express.static(path.join(__dirname,"../client/dist")))

app.get( '/blocks', (req, res) => {
res.json(bc.chain);

});

app.post('/mine', (req,res)=> {

const block = bc.addBlock(req.body.data)

console.log(`new block added:${block.toString()}`);

p2pServer.syncChains();

res.redirect('/blocks');

});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
}); 

app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp);
/* agora as transações serão enviadas ao longo da rede e os message handlers vão adicioná-las
ao pool de transações.
*/
    p2pServer.broadcastTransaction(transaction);
    // store transactions on the block itself.
 //   p2pServer.broadcastTransaction(transaction);
  
    res.redirect('/transactions');
  });

  app.get('/api/wallet-info',(req,res)=>{
    res.json({publicKey:wallet.publicKey,balance:wallet.balance}) 
    
  })

  app.get("*",(req,res) =>{

    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

app.listen(HTTP_PORT, () => {

console.log(`Listening on port ${HTTP_PORT}`)

p2pServer.listen()

});

