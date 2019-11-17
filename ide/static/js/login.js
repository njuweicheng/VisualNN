import React from 'react';
import AlertLabel from './alertLabel';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: false,
      isOpenLoginPanel: false,
      isOpenSignUpPanel: false,

      /* alertType choices:
       * 1. alert alert-success
       * 2. alert alert-info
       * 3. alert alert-warning
       * 4. alert alert-danger
       * additional attribute: alert-dismissible
       */
      ifShowAlertSignUp: false,
      ifShowAlertLogIn: false,
      alertText: '',
      alertType: 'alert alert-danger',
      loginName: ''
    };
    // this.tryLogin = this.tryLogin.bind(this);
    this.trySignUp = this.trySignUp.bind(this);
    this.cancelSignUp = this.cancelSignUp.bind(this);
    this.confirmSignUp = this.confirmSignUp.bind(this);
    this.logoutUser = this.logoutUser.bind(this);

    this.loginUser = this.loginUser.bind(this);

    this.clearSignUpInput = this.clearSignUpInput.bind(this);
    this.clearLoginInput = this.clearLoginInput.bind(this);
  }

  componentWillMount() {
    this.setState({ 
      loginState: false,
      isOpenLoginPanel: false,
      isOpenSignUpPanel: false ,
      ifShowAlertSignUp: false,
      ifShowAlertLogIn: false,
      loginName: ''
    });
    
  }

  componentDidMount() {
    // this.tryLogin(false);
  }

  clearLoginInput(){
    $('#login-username-input')[0].value = "";
    $('#login-password-input')[0].value = "";
  }

  clearSignUpInput(){
    $('#sign-up-username-input')[0].value = "";
    $('#sign-up-password-input')[0].value = "";
    $('#sign-up-password-repeat')[0].value = "";
  }

  logoutUser() {
/*
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
*/
    this.setState({ 
      loginState: false,
      loginName: '',
      isOpenLoginPanel: false,
      isOpenSignUpPanel: false,
      ifShowAlertSignUp: false,
      ifShowAlertLogIn: false
    });
    this.props.userLogOutMain();
  }

  loginUser() {

      let username = $('#login-username-input')[0].value;
      let password = $('#login-password-input')[0].value;

      if (username.length == 0){

	this.setState({
            ifShowAlertLogIn: true,
            alertText: "User name can't be empty!",
            alertType: 'alert alert-danger'
	});
      }else if(password.length == 0){
    
	this.setState({
            ifShowAlertLogIn: true,
            alertText: "Password can't be empty!",
            alertType: 'alert alert-danger'
	});
      } else{

      $.ajax({
          url: '/backendAPI/logIn',
          type: 'GET',
          contentType: false,
          data: {
              username: username,
              password: password
          },
          success: function(response){
              switch(response.result){
                  case 'user_login_success':
                      this.setState({
                          isOpenLoginPanel: false,
                          isOpenSignUpPanel: false,
                          ifShowAlertSignUp: false,
                          loginState: true,
                          loginName: response.username
                      });
                      this.props.userLogInMain(response.username);
                      break;
                  case 'user_login_password_error':
                      this.setState({
                          isOpenLoginPanel: true,
                          isOpenSignUpPanel: false,
                          ifShowAlertLogIn: true,
                          alertText: "Invalid password, please try again.",
                          alertType: 'alert alert-danger'
                      });
                      break;
                  case 'user_name_not_exist':
                      this.setState({
                          isOpenLoginPanel: true,
                          isOpenSignUpPanel: false,
                          ifShowAlertLogIn: true,
                          alertText: "Username doesn't exist, please try again.",
                          alertType: 'alert alert-danger'
                      });
                      break;
                  case 'database_error':
                      this.setState({
                          isOpenLoginPanel: true,
                          isOpenSignUpPanel: false,
                          ifShowAlertLogIn: true,
                          alertText: "Unexpected error, please try again.",
                          alertType: 'alert alert-danger'
                      });
                      break;
                  case 'user_login_failure': 
                      this.setState({
                          isOpenLoginPanel: true,
                          isOpenSignUpPanel: false,
                          ifShowAlertLogIn: true,
                          alertText: "Unexpected error, please try again.",
                          alertType: 'alert alert-danger'
                      });
                      break;
                  default:
                      console.log('Log in unhandled case.');
              }
          }.bind(this),
          error(){}
      });
    }

  }

  openLoginPanel() {
    this.setState({
      isOpenLoginPanel: true,
      ifShowAlertSignUp: false,
      ifShowAlertLogIn: false
    });
  }

  closeLoginPanel() {
    this.setState({
      isOpenLoginPanel: false,
      isOpenSignUpPanel: false,
      ifShowAlertSignUp: false,
      ifShowAlertLogIn: false

    });
  }
/*
  tryLogin(showNotification) {
    let username = null;
    let password = null;

    if (this.state.isOpenLoginPanel) {
      username = $('#login-username-input')[0].value;
      password = $('#login-password-input')[0].value;
    }
    console.log(username);
    console.log(password);
    console.log(showNotification);

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

  }
*/

  // try signing up, change frontend.
  trySignUp(){
    this.clearLoginInput();
    this.setState({ isOpenSignUpPanel: true });
  }

  // cancel signing up
  cancelSignUp(){
    this.setState({ 
        isOpenSignUpPanel: false,
	ifShowAlertSignUp: false,
	ifShowAlertLogIn: false
    });
    this.clearSignUpInput();
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

    if (username.length == 0){

	this.setState({
            ifShowAlertSignUp: true,
            alertText: "User name can't be empty!",
            alertType: 'alert alert-danger'
	});

    }else if(password.length == 0){
    
	this.setState({
            ifShowAlertSignUp: true,
            alertText: "Password can't be empty!",
            alertType: 'alert alert-danger'
	});

    }else if(password !== passwordRepeat){

	this.setState({
            ifShowAlertSignUp: true,
            alertText: "Password discrepancy!",
            alertType: 'alert alert-danger'
	});

    } else{

	$.ajax({
            url: '/backendAPI/signUp',
            type: 'GET',
            contentType: false,
            data: {
		username: username,
		password: password
            },
            success: function(response) {

                switch(response.result){
                    case 'user_already_exists':
                        
                        this.setState({
                            isOpenLoginPanel: true,
                            isOpenSignUpPanel: true,
                            ifShowAlertSignUp: true,
                            alertText: "Username already exists, please use another name.",
                            alertType: 'alert alert-warning'
                        });
                    
                        console.log('User ' + response.username + ' already exists.');
                        break;
                    case 'user_create_success':
                        
                        this.setState({
                            isOpenLoginPanel: true,
                            isOpenSignUpPanel: false,
                            ifShowAlertSignUp: false,

                            ifShowAlertLogIn: true,
                            alertText: "Sign up successfully, you can now log in.",
                            alertType: 'alert alert-success'
                        });
                        console.log('User ' + response.username + ' created successfully.');
                        break;
                    case 'user_create_failure':
    
                        this.setState({
                            isOpenLoginPanel: true,
                            isOpenSignUpPanel: true,
                            isShowAlertSignUp: true,
                            alertText: "Error occurs, please try again.",
                            alertType: 'alert alert-danger'
                        });

                        console.log(response.info);
                        console.log('User create failure.');
                        break;
                    default:
                        console.log('Unhandled case in sign up!');
                }
          
            }.bind(this),
            error() {
            }
	});

	this.clearSignUpInput();
    } 
  }

  render() {
    let panel = null;
    let signUpAlertDiv = null;
    let logInAlertDiv = null;

    if(this.state.ifShowAlertSignUp){

	signUpAlertDiv = (
            <AlertLabel 
		display="block"
		text={this.state.alertText}
		alertType={this.state.alertType}
            />
	);
    }else if(this.state.ifShowAlertLogIn){
	logInAlertDiv = (
            <AlertLabel 
		display="block"
		text={this.state.alertText}
		alertType={this.state.alertType}
            />
	);
    }

    if (this.state.isOpenLoginPanel) {
      if (this.state.isOpenSignUpPanel){
          panel = (
            <div id="login-prepanel" className="login-prepanel-enabled" onClick={
              (e) => {
                if (e.target.id == "login-prepanel") {
                  this.closeLoginPanel();
                }
              }
            }>
            <div className="login-panel">
              <button type="button" className="btn btn-default pull-right" aria-label="Left Align" 
                       onClick={ () => this.closeLoginPanel() }>
                  <div className="glyphicon glyphicon-remove" aria-hidden="true"></div>
              </button>
              <div className="login-panel-main">
                {signUpAlertDiv}
                <h5 className="sidebar-heading">
                  <input placeholder="Enter user name" autoCorrect="off" id="sign-up-username-input"></input>
                </h5>
                <h5 className="sidebar-heading">
                  <input type="password" placeholder="Enter password" id="sign-up-password-input"></input>
                </h5>
                <h5 className="sidebar-heading">
                  <input type="password" placeholder="Enter password again" id="sign-up-password-repeat"></input>
                </h5>

		
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
        }
         else {
          panel = (
          <div id="login-prepanel" className="login-prepanel-enabled" onClick={
              (e) => {
                if (e.target.id == "login-prepanel") {
                  this.closeLoginPanel();
                }
              }
            }>
            <div className="login-panel">
              <button type="button" className="btn btn-default pull-right" aria-label="Left Align" 
                       onClick={ () => this.closeLoginPanel() }>
                  <div className="glyphicon glyphicon-remove" aria-hidden="true"></div>
              </button>

              <div className="login-panel-main">
                {logInAlertDiv}
                <h5 className="sidebar-heading">
                  <input placeholder="Enter user name" autoCorrect="off" id="login-username-input"></input>
                </h5>
                <h5 className="sidebar-heading">
                  <input type="password" placeholder="Enter password" id="login-password-input"></input>
                </h5>


                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-6 login-button" id="login-button">
                    <a className="btn btn-block btn-social" onClick={ () => this.loginUser() } style={{width: '105px'}}>
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
        }
    }

    if(this.state.loginState) {
      return (
        <div>
            <div className="col-md-5">
                <h5 className="sidebar-heading text-center">{this.state.loginName}</h5>
            </div>
            <div className="col-md-7">
                <h5 className="sidebar-heading" id="sidebar-login-button" onClick={
                    () => { this.logoutUser();}}>
                    <div>LOGOUT</div>
                </h5>
            </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="col-md-5">
              <h5 className="sidebar-heading text-center">Not logged in.</h5>      
          </div>
          <div className="col-md-7">
              <h5 className="sidebar-heading" id="sidebar-login-button" onClick={
                  () => {this.openLoginPanel();}}>
                  <div>LOGIN</div>
              </h5>
          </div>
          {panel}
        </div>
      )
    }
  }
}

Login.propTypes = {
  setUserId: React.PropTypes.func,
  setUserName: React.PropTypes.func,
  userLogInMain: React.PropTypes.func,
  userLogOutMain: React.PropTypes.func
};

export default Login;


