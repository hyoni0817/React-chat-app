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

      const { classes } = this.props;
      const {msgData} = this.state;
      const msgList = msgData.map((msg, idx) => (
        <li key={idx}>{msg}</li>
      ))
      return (
        <Fragment>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
          <ul id="messages">
            {msgList}
          </ul>
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
