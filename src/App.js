import React, { Component, Fragment } from 'react';
import './App.css';
import { msgOn, msgEmit, userView } from './socket';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';

let saveStat = false;
let date = new Date();
let todayDate = date.getFullYear() + "년 " + (date.getMonth()+1) + "월 " + date.getDate() + "일";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  textField: {
    border: 0,
  }
});

class App extends Component {
  input = React.createRef();

  state = {
    message : '',
    msgData : [{date:todayDate, time:'N', sysmsg:'todayDate'}],
    myNick : ''
  }
  
  componentDidMount(){
    //const {msgData} = this.state;
    //이곳에 선언하면 메세지가 쌓이지 못하고 새로운 내용으로 계속 교체된다.
    msgOn(data => {
      // 리스트로 메세지 보여주기 위한 코드
      const {msgData} = this.state; 
      let msgInfo = (data.time !== 'N' ? {message : data.msg, date : data.date, time : data.time, id : data.id, myMsg : 'N'} : data)

      this.setState({
        msgData:msgData.concat(msgInfo)
      })
      //새 메시지가 추가될 때마다 스크롤이 아래로 향한다.
      window.scrollTo(0, document.body.scrollHeight);
    });

    //입장한 user정보 msgData에 저장하기
    userView( userInfo => {
      const {msgData} = this.state;
      let dateView = '';

      if(saveStat === false) {
        this.setState({myNick : userInfo.userId})
        saveStat = true;
      }
      this.setState({
        msgData:msgData.concat(userInfo)
      })
    })
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

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {message, msgData} = this.state; 
    let date = new Date();
    let msgDate = date.getFullYear() + "년 " + (date.getMonth()+1) + "월 " + date.getDate() + "일";
    let amORpm = (date.getHours() < 12 ? "오전 " : "오후 ")
    let hours = (date.getHours()>0 && date.getHours() % 12 ? date.getHours() % 12 : 12);
    let msgTime = amORpm + (date.getMinutes() < 10 ? hours + ":" + "0" + date.getMinutes() : hours + ":" + date.getMinutes());
    
    const msgInfo = {message : message, date : msgDate, time : msgTime, myMsg : 'Y'};
    let dateAlarm = '';
    
    if(msgData[msgData.length-1].date !== msgDate) {
      dateAlarm = {date:msgDate, time:'N', sysmsg:'todayDate'}
      this.setState({msgData : msgData.concat(dateAlarm,msgInfo)});
      msgEmit(dateAlarm)
      msgEmit(msgInfo)
    } else {
      dateAlarm = {message : message, date : msgDate, time : msgTime};
      this.setState({msgData : msgData.concat(msgInfo)});
      msgEmit(dateAlarm);
    }
    
    this.setState({ message : ''});

    this.input.current.focus();
    
  }
  
  render() {
      const { classes } = this.props;
      const {msgData, myNick} = this.state;
      var id = 0;
      const msgList = msgData.map((msg, idx) => {
        let msgStat = '', msgBox = '', userView = '';
        function timeView(msgTime) {
          return ( msgData[idx+1] !== undefined && (msgData[idx+1].id === msg.id) && (msgData[idx+1].time === msg.time) ? '' : <p className={msgTime}>{msg.time}</p>);
        }

        userView = (idx !== 0 && (msg.time !== msgData[idx-1].time) ? <p className="user-id"><strong>{msg.id}</strong></p> : (idx !== 0 && (msg.id !== msgData[idx-1].id) ? <p className="user-id"><strong>{msg.id}</strong></p> : ''));

        if(msg.sysmsg === undefined) {
          msgStat = (msg.myMsg !== 'Y' ? "other-msg" : "my-msg");
          msgBox = ( msgStat === 'other-msg' ? <div key={++id}>{userView}<div className={msgStat}><p className="msg">{msg.message}</p></div>{timeView('other-msg-time')}</div> : <div key={++id}><div className={msgStat}><p className="msg">{msg.message}</p></div>{timeView('my-msg-time')}</div>)

          return msgBox;
        } else {
            if(msg.sysmsg === 'entrance') {
              return (myNick === msg.userId ? <div key={++id}><p className="my-entrace"><strong>{msg.userId}(나)님</strong>이 입장했습니다.</p></div> : <div key={++id}><p id="user-entrace"><strong>{msg.userId}님</strong>이 입장했습니다.</p></div>)
            } else if(msg.sysmsg === 'out'){
              return <div key={++id}><p className="user-out"><strong>{msg.userId}님</strong>이 퇴장했습니다.</p></div>
            } else {
              return <div key={++id}><p className="today-date"><strong>{msg.date}</strong></p></div>
            }
        }
      })
      return (
        <Fragment>
          <link href="https://fonts.googleapis.com/css?family=Nanum+Gothic" rel="stylesheet"></link>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
          <div id="msgList" ref={ref => {this.msgList = ref;}}>
            {msgList}
          </div>
          <form onSubmit={this.handleSubmit}>
            <div class="msg-send-part">
              <div id="contents">
                <TextField
                  id="standard-multiline-flexible"
                  multiline
                  rowsMax="4"
                  autoComplete="off"
                  style={{ margin: 8 }}
                  placeholder="메세지를 입력해주세요"
                  className={classes.textField}
                  value={this.state.message}
                  onKeyPress={this.onKeyPress} 
                  fullWidth
                  onChange={e => this.setState({ message: e.target.value})} 
                  inputRef={this.input}
                  margin="normal"
                />
              </div>
              <div id="send-btn">
                <Button variant="contained" color="primary" onClick={this.handleSubmit} className={classes.button}>
                  {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                  <Icon className={classes.rightIcon}>send</Icon>
                </Button>
              </div>
            </div>  
          </form>
        </Fragment>
      );
      
  }

}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);