import React, { Component } from "react";
import MonstersContract from "./contracts/Monsters.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    instance: null,
    userInp: "",
    monsters: [],
    uid: null,
    message: "",
    userCount: null,
    totalSupply: null,
    owners: [],
    tranfertokenID: null,
    toAddress: "",
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MonstersContract.networks[networkId];
      const instance = new web3.eth.Contract(MonstersContract.abi, deployedNetwork && deployedNetwork.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      let userCount = await instance.methods.balanceOf(accounts[0]).call();
      let totalSupply = await instance.methods.totalSupply().call();
      for (let i = 1; i <= totalSupply; i++) {
        const monsters = await instance.methods.monsters(i - 1).call();
        this.setState({ monsters: [...this.state.monsters, monsters] });
        const owner = await instance.methods.ownerOf(i).call();
        this.setState({ owners: [...this.state.owners, owner] });
      }
      console.log(this.state.owners[0]);
      let uid = await instance.methods._id().call();
      this.setState({ web3, accounts, instance: instance, userCount, uid });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ message: "Wait while we create your monster" });
    await this.state.instance.methods.mint(this.state.userInp).send({ from: this.state.accounts[0] });
    this.setState({ message: "Character Created" });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleTransfer = async (e) => {
    e.preventDefault();
    this.setState({ message: "Hey wait while you trade the monster" });
    await this.state.instance.methods
      .safeTransferFrom(this.state.accounts[0], this.state.toAddress, this.state.tranfertokenID)
      .send({ from: this.state.accounts[0] });
    this.setState({ message: "Bruh! You just traded!" });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <>
        <div className="container center">
          <h1>Monster Tokens</h1>
          <h5>The contract is deployed from {this.state.accounts[0]}</h5>
        </div>
        <div className="container center">
          <div className="row">
            <form className="col s12" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="input-field col s6">
                  <input id="userInp" type="text" onChange={this.handleChange} />
                  <label htmlFor="first_name">Enter any random text</label>
                </div>
                <div className="input-field col s6">
                  <button className="btn">Mint Monsters</button>
                </div>
              </div>
            </form>
          </div>
          <div className="row">
            {this.state.monsters.map((monster, key) => {
              return (
                <div className="col s12 m6 l3" key={key}>
                  <div className="card small blue-grey darken-1">
                    <div className="card-content white-text">
                      <span className="card-title">{monster.toUpperCase()}</span>
                      <img src={`https://robohash.org/set_set3/${monster}?size=150x150`} alt="" />
                      <p>Your Character UID : {key + 1}</p>
                      <p>Owned by:{this.state.owners[key]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="section center">
            <h4>Your total Number of Monster Tokens: {this.state.userCount}</h4>
          </div>
          <div className="tranfer section">
            <h5>Tranfer your Monsters</h5>
            <p>Wanna trade monsters? Use the address of another trader and enter the ID of the monster</p>
            <div className="row">
              <form className="col s12" onSubmit={this.handleTransfer}>
                <div className="row">
                  <div className="input-field col s6">
                    <input id="toAddress" type="text" onChange={this.handleChange} />
                    <label htmlFor="first_name">Enter the Address of Another trader</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="tranfertokenID" type="text" onChange={this.handleChange} />
                    <label htmlFor="first_name">Enter the Monster UID</label>
                  </div>
                  <div className="input-field col s6">
                    <button className="btn">Transfer</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
