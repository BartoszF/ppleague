import React from "react";
import "./App.css";
import { Provider, observer } from "mobx-react";
import { Route, Router, Switch } from "react-router-dom";
import playerStore from "./stores/playerStore";
import userStore from "./stores/userStore";
import matchStore from "./stores/matchStore";
import LadderPage from "./pages/ladderPage/ladderPage";
import { Layout, notification } from "antd";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginPage from "./pages/loginPage/LoginPage";
import { Component } from "react";
import SignupPage from "./pages/signupPage/Signup";
import UserService from "./services/UserService";
import { ACCESS_TOKEN, APP_NAME } from "./constants";

import history from "./history";
import AppHeader from "./components/common/AppHeader";
import LoadingIndicator from "./components/common/LoadingIndicator";
import MatchService from "./services/MatchService";

const { Content } = Layout;

const stores = { playerStore, userStore, matchStore };

@observer
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });

    UserService.getCurrentUser()
      .then(response => {
        console.log(response);

        userStore.setUser(response);
        playerStore.setUserPlayer(response.player);

        console.log(userStore.getUserString());
        console.log(userStore.isAuthenticated);

        MatchService.getOngoinMatch().then((response) => {
          matchStore.setOngoingMatch(response);
          console.log(response);
        }).catch(err => {
          console.log(err);
        });

        UserService.getNotifications().then((response) => {
            console.log(response);
        }).catch(err => {
            console.log(response);
        })

        this.setState({
          isLoading: false
        });

        history.push("/");
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  // Handle Logout, Set currentUser and isAuthenticated state which will be passed to other components
  handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);

    userStore.isAuthenticated = false;
    userStore.id = 0;
    userStore.username = "";

    history.push(redirectTo);

    notification[notificationType]({
      message: APP_NAME,
      description: description
    });
  }

  /*
 This method is called by the Login component after successful login
 so that we can load the logged-in user details and set the currentUser &
 isAuthenticated state, which other components will use to render their JSX
*/
  handleLogin() {
    notification.success({
      message: APP_NAME,
      description: "You're successfully logged in."
    });
    this.loadCurrentUser();
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout className="layout">
        <Provider {...stores}>
          <Router history={history}>
            <AppHeader onLogout={this.handleLogout} />
            <Content className="app-content">
              <div className="container">
                <Switch>
                  <PrivateRoute
                    exact
                    path="/"
                    {...stores}
                    component={LadderPage}
                    handleLogout={this.handleLogout}
                  ></PrivateRoute>
                  <Route
                    exact
                    path="/login"
                    render={props => (
                      <LoginPage onLogin={this.handleLogin} {...props} />
                    )}
                  ></Route>
                  <Route exact path="/signup" component={SignupPage} />
                    <Route render={props => (<div>NotFound</div>)} />
                </Switch>
              </div>
            </Content>
          </Router>
        </Provider>
      </Layout>
    );
  }
}

export default App;
