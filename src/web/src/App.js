import React, {Component} from "react";
import "./App.css";
import {observer, Provider} from "mobx-react";
import {Route, Router, Switch} from "react-router-dom";

import playerStore from "./stores/playerStore";
import userStore from "./stores/userStore";
import matchStore from "./stores/matchStore";

import LadderPage from "./pages/ladderPage/ladderPage";
import {Layout, notification} from "antd";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginPage from "./pages/loginPage/LoginPage";
import SignupPage from "./pages/signupPage/Signup";
import UserService from "./services/UserService";
import PlayerService from "./services/PlayerService";
import {ACCESS_TOKEN, APP_NAME} from "./constants";
import SockJsClient from 'react-stomp';
import _ from 'lodash';

import history from "./history";
import AppHeader from "./components/common/AppHeader";
import LoadingIndicator from "./components/common/LoadingIndicator";


const {Content} = Layout;

const stores = {playerStore, userStore, matchStore};

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

                userStore.setUser(response);
                playerStore.setUserPlayer(response.player);

                console.log(userStore.getUserString());
                console.log(userStore.isAuthenticated);

                matchStore.getOngoingMatch();

                userStore.getNotifications();

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
        if (Notification.permission !== 'denied') {
            Notification.requestPermission()
        }
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

    getSwitch(props) {
        if (this.state.isLoading) {
            return <LoadingIndicator/>;
        } else {
            return (
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
                    <Route exact path="/signup" component={SignupPage}/>
                    <Route render={props => (<div>NotFound</div>)}/>
                </Switch>);
        }
    }

    handleWebsocket(msg) {
        console.log(msg);
        if(_.has(msg,'notification')){
            let notif = userStore.addNotification(msg.notification);

            if (Notification.permission === "granted") {
                var notifObj = new Notification(notif.title);
                setTimeout(notifObj.close.bind(notifObj), 4000);
            }
        }

        if(_.has(msg,'ongoing_match')){
            console.log("Setting ongoing match");
            matchStore.setOngoingMatch(msg.ongoing_match);
        }

        if(_.has(msg,'end_match')){
            matchStore.setOngoingMatch(null);
            PlayerService.getPlayers().then((response) => {
                playerStore.setPlayers(response);
            })
        }
    }

    render() {
        return (
            <Layout className="layout">
                <Provider {...stores}>
                    <SockJsClient
                        url={"/ws"}
                        topics={["/user/topic/notify"]}
                        debug={true}
                        onMessage={(msg) => {
                            this.handleWebsocket(msg);
                        }}
                        onConnect={() => {
                            console.log("ws connected")
                            this.clientRef.sendMessage("/app/register", JSON.stringify({username: userStore.username}));
                        }}
                        ref={(client) => {
                            this.clientRef = client
                        }}/>
                    <Router basename={"/web"} history={history}>
                        <AppHeader onLogout={this.handleLogout}/>
                        <Content className="app-content">
                            <div className="container">
                                {this.getSwitch()}
                            </div>
                        </Content>
                    </Router>
                </Provider>
            </Layout>
        );
    }
}

export default App;
