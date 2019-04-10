import React, { Component, Fragment } from 'react';
import './App.css';
import { msgOn, msgEmit } from './socket';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  textField: {
    border: 0,
    width: '80%', 
    marginRight: '.5%'
  }
});

class App extends Component {
  input = React.createRef();

  state = {
    message : '',
    msgData : [],
  }

  componentDidMount(){
    //const {msgData} = this.state;
    //이곳에 선언하면 메세지가 쌓이지 못하고 새로운 내용으로 계속 교체된다.
    msgOn(message => {
      // 리스트로 메세지 보여주기 위한 코드
      const {msgData} = this.state; 
      const output = {message : message, myMsg : 'N'}
      this.setState({
        msgData:msgData.concat(output)
      })
      //새 메시지가 추가될 때마다 스크롤이 아래로 향한다.
      window.scrollTo(0, document.body.scrollHeight);
    });

  }

  getSnapshotBeforeUpdate(prevProps, prevState) {

    if (prevState.msgData !== this.state.msgData) {
      const { scrollTop, scrollHeight } = this.msgList;

      return {
        scrollTop,
        scrollHeight
      };
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      const { scrollTop } = this.msgList;

      if (scrollTop !== snapshot.scrollTop) return; // 기능이 이미 구현되어있다면 처리하지 않습니다.
     
      //본인이 작성한 메시지가 추가될 때마다 스크롤이 아래로 향한다.
      window.scrollTo(0,document.body.scrollHeight)

    }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const {message, msgData} = this.state; 
    const output = {message : message, myMsg : 'Y'};
    this.setState({msgData : msgData.concat(output)});
    msgEmit(message);
    this.setState({ message : '', msgData: msgData.concat(output)});

    this.input.current.focus();
    
  }
  
  render() {
      const { classes } = this.props;
      const {msgData} = this.state;
      var id = 0;
      
      const msgList = msgData.map((msg) => {
        let msgStat = (msg.myMsg !== 'Y' ? "other-msg" : "my-msg");
        return <div className={msgStat} key={++id}><span className="msg">{msg.message}</span></div>
      })
      
      return (
        <Fragment>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
          <div id="msgList" ref={ref => {this.msgList = ref;}}>
            {msgList}
          </div>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="contents"
              autoComplete="off"
              style={{ margin: 8 }}
              placeholder="메세지를 입력해주세요"
              className={classes.textField}
              value={this.state.message} 
              onChange={e => this.setState({ message: e.target.value})} 
              inputRef={this.input}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={this.handleSubmit} className={classes.button}>
              Send
              {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
              <Icon className={classes.rightIcon}>send</Icon>
            </Button>
          </form>
        </Fragment>
      );
      
  }

}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
