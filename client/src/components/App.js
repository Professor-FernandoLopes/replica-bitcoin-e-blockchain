
import React,{Component} from "react"

class App extends Component {

state={
walletInfo: {address:"foo", balance:"9999"}
};

componentDidMount() {
    fetch('http://localhost:3001/api/wallet-info')
      .then(response => response.json())
      .then(json => this.setState({walletInfo: {address:json.publicKey,balance:json.balance}}) );
     
  }

render() {

const {address,balance}= this.state.walletInfo;

return(
<div>
<div>Welcome to the blockchain Marcus Lisboa </div>
<div> address:{address} </div>
<div> balance:{balance} </div>
</div> 
);
}

}

export default App