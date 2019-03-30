import React, { Component, Fragment } from 'react';
import './App.css';
import { msgOn, msgEmit } from './socket';



class App extends Component {
  input = React.createRef();
  state = {
    message : '',
    msgData : []
  }

  componentDidMount(){
    //const {msgData} = this.state; 
    //이곳에 선언하면 메세지가 쌓이지 못하고 새로운 내용으로 계속 교체된다.
    msgOn(message => {
      // 리스트로 메세지 보여주기 위한 코드
      const {msgData} = this.state; 

      this.setState({
        msgData:msgData.concat(message)
      })
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    msgEmit(this.state.message);

    this.setState({ message : '' });
    this.input.current.focus();
  }
  render() {
    const {msgData} = this.state;
    const msgList = msgData.map((msg, idx) => (
      <p key={idx}>{msg}</p>
    ))
    return (
      <Fragment>
        <div>
          {msgList}
        </div>
        <form onSubmit={this.handleSubmit}>
          <input id="contents" autoComplete="off" value={this.state.message} onChange={e => this.setState({ message: e.target.value})} ref={this.input}/><button>Send</button>
        </form>
      </Fragment>
    );
  }
}

export default App;
