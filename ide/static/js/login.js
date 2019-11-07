import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: false,
      isOpenLoginPanel: false,
      isOpenSignUpPanel: false,

      ifPasswordDiscrepency: false
    }
    this.tryLogin = this.tryLogin.bind(this);
    this.trySignUp = this.trySignUp.bind(this);
    this.cancelSignUp = this.cancelSignUp.bind(this);
    this.confirmSignUp = this.confirmSignUp.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  componentWillMount() {
    this.setState({ 
	loginState: false,
	isOpenLoginPanel: false,
	isOpenSignUpPanel: false 
    });
    
  }

  componentDidMount() {
    // this.tryLogin(false);
  }
  logoutUser() {
    $.ajax({
      url: '/accounts/logout',
      type: 'GET',
      processData: false,  // tell jQuery not to process the data
      contentType: false,
      success: function (response) {
        if (response) {
          this.setState({ loginState: false });
          this.props.setUserId(null);
          this.props.setUserName(null);
        }
      }.bind(this),
      error: function () {
        this.setState({ loginState: true });
        this.addError("Error occurred while logging out");
      }.bind(this)
    });
    this.setState({ 
	isOpenLoginPanel: false,
	isOpenSignUpPanel: false
    });
  }
  openLoginPanel() {
    this.setState({
      isOpenLoginPanel: true
    });
  }
  closeLoginPanel() {
    this.setState({
      isOpenLoginPanel: false,
      isOpenSignUpPanel: false,
      ifPasswordDiscrepency: false
    });
  }
  tryLogin(showNotification) {
    let username = null;
    let password = null;

    if (this.state.isOpenLoginPanel) {
      username = $('#login-input')[0].value;
      password = $('#password-input')[0].value;
    }
    console.log(username);
    console.log(password);
    console.log(showNotification);

/*
    $.ajax({
      url: '/backendAPI/checkLogin',
      type: 'GET',
      contentType: false,
      data: {
        username: username,
        password: password,
        isOAuth: (!showNotification)
      },
      success: function (response) {
        if (response.result) {
          this.setState({ loginState: response.result });
          this.props.setUserId(response.user_id);
          this.props.setUserName(response.username);

          if (showNotification) {
            $('#successful-login-notification')[0].style.display = 'block';
            $('#successful-login-notification-message')[0].innerHTML = 'Welcome, ' + username + '!';

            setTimeout(() => {
              let elem = $('#successful-login-notification')[0];
              if (elem) {
                elem.style.display = 'none';
              }
            }, 3000);
          }
        }
        else {
          if (showNotification) {
            $('#login-error-message-text')[0].innerHTML = response.error; 
            $('#login-error-message')[0].style.display = 'block'; 
          }
        }
      }.bind(this),
      error: function () {
        this.setState({ loginState: false });
      }.bind(this)
    });
*/
  }

  // try signing up, change frontend.
  trySignUp(){
    this.setState({ isOpenSignUpPanel: true });
  }

  // cancel signing up
  cancelSignUp(){
    this.setState({ 
        isOpenSignUpPanel: false,
        ifPasswordDiscrepency: false 
    });
    $('#sign-up-username-input')[0].value = "";
  }


  // confirm signing up
  confirmSignUp() {
    
    console.log("Confirm Signup.");


    let username = $('#sign-up-username-input')[0].value;
    let password = $('#sign-up-password-input')[0].value;
    let passwordRepeat = $('#sign-up-password-repeat')[0].value;

    console.log(username);
    console.log(password);
    console.log(passwordRepeat);

    if (password !== passwordRepeat) {
	// console.log("password discrepency!");
	this.setState({ ifPasswordDiscrepency: true });
    } else {


    $.ajax({
      url: '/backendAPI/signUp',
      type: 'GET',
      contentType: false,
      data: {
        username: username,
        password: password
      },
      success: function (response) {
	this.setState({
            isOpenLoginPanel: true,
            isOpenSignUpPanel: false,
            ifPasswordDiscrepency: false
	});
	console.log('User ' + response.username + ' created.');
	
      }.bind(this),

      error: function () {
        
      }.bind(this)
    });
    $('#sign-up-username-input')[0].value = "";

    }
    
  }

  render() {
    let loginPanel = null;
    let signupPanel = null;
    let warningLabel = null;
    let panel = null;

    if (this.state.ifPasswordDiscrepency) {
       warningLabel =  (
           <span className="label label-danger">Password Discrepency!</span>
       );
    } 

    if (this.state.isOpenLoginPanel) {
	if (this.state.isOpenSignUpPanel){
         signupPanel = (

        <div id="login-prepanel" className="login-prepanel-enabled" onClick={
              (e) => {
                if (e.target.id == "login-prepanel" || e.target.id == "login-panel-close") {
                  this.closeLoginPanel();
                }
              }
            }>
            <div className="login-panel">

              <i className="material-icons" id="login-panel-close">x</i>
              <div className="login-logo">
                <img src="/static/img/fabrik_t.png" className="img-responsive" alt="logo" id="login-logo"></img>
              </div>
              <div className="login-panel-main">
		{warningLabel}
                <h5 className="sidebar-heading">
                  <input placeholder="Enter user name" autoCorrect="off" id="sign-up-username-input"></input>
                </h5>
                <h5 className="sidebar-heading">
                  <input type="password" placeholder="Enter password" id="sign-up-password-input"></input>
                </h5>
                <h5 className="sidebar-heading">
                  <input type="password" placeholder="Enter password again" id="sign-up-password-repeat"></input>
                </h5>

                <div id="login-error-message">
                  <i className="material-icons">close</i>
                  <div id="login-error-message-text"></div>
                </div>
		
                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-6 login-button" id="sign-up-back-button">
                    <a className="btn btn-block btn-social" onClick={() => this.cancelSignUp() } style={{width: '105px'}}>
                      <span className="fa fa-sign-in"></span>Back
                    </a>
                  </div>
                </h5>

                <h5 className="sidebar-heading login-prebtn">
                
		<div className="col-md-5 login-button" id="signup-confirm-button">
                    <a className="btn btn-block btn-social" onClick={ () => this.confirmSignUp() } style={{width: '105px'}}>
                      <span className="fa fa-sign-in"></span>Sign Up
                    </a>
                  </div>
                </h5>

            </div>
            </div>
        </div>
          );
          panel = signupPanel;
        }
         else {
      loginPanel = (
        <div id="login-prepanel" className="login-prepanel-enabled" onClick={
              (e) => {
                if (e.target.id == "login-prepanel" || e.target.id == "login-panel-close") {
                  this.closeLoginPanel();
                }
              }
            }>
            <div className="login-panel">
              <i className="material-icons" id="login-panel-close">x</i>
              <div className="login-logo">
                <img src="/static/img/fabrik_t.png" className="img-responsive" alt="logo" id="login-logo"></img>
              </div>
              <div className="login-panel-main">
                <h5 className="sidebar-heading">
                  <input placeholder="Enter user name" autoCorrect="off" id="login-input"></input>
                </h5>
                <h5 className="sidebar-heading">
                  <input type="password" placeholder="Enter password" id="password-input"></input>
                </h5>

                <div id="login-error-message">
                  <i className="material-icons">close</i>
                  <div id="login-error-message-text"></div>
                </div>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-6 login-button" id="login-button">
                    <a className="btn btn-block btn-social" onClick={ () => this.tryLogin(true) } style={{width: '105px'}}>
                      <span className="fa fa-sign-in"></span>Login
                    </a>
                  </div>
                </h5>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-5 login-button">
                    <a className="btn btn-block btn-social" onClick={() => this.trySignUp()}  style={{width: '105px'}}>
                      <span className="fa fa-user-plus"></span>Sign up
                    </a>
                  </div>
                </h5>

                <h5 className="sidebar-heading extra-login">
                  OTHER
                </h5>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-6">
                    <a className="btn btn-block btn-social btn-github" onClick={
                        () => window.location="/accounts/github/login"
                      } style={{width: '105px'}}>
                      <span className="fa fa-github"></span>Github
                    </a>
                  </div>
                </h5>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-5">
                    <a className="btn btn-block btn-social btn-google" onClick={
                        () => window.location="/accounts/google/login"
                      }  style={{width: '105px'}}>
                      <span className="fa fa-google"></span>Google
                    </a>
                  </div>
                </h5>

              </div>
            </div> 
          </div>);
          panel = loginPanel;
	}
    }

    if(this.state.loginState) {
      return (
        <div>
          <h5 className="sidebar-heading" id="sidebar-login-button" onClick={
            () => {
              this.logoutUser();
          }}>
          <div>LOGOUT</div>
          </h5>
          <div id="successful-login-notification">
            <i className="material-icons">done</i>
            <div id="successful-login-notification-message"></div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <h5 className="sidebar-heading" id="sidebar-login-button" onClick={
            () => {
              this.openLoginPanel();
            }}>
            <div>LOGIN</div>
          </h5>
          {panel}
        </div>
      )
    }
  }
}

Login.propTypes = {
  setUserId: React.PropTypes.func,
  setUserName: React.PropTypes.func
};

export default Login;
