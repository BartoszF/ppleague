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
import ProfilePage from "./pages/profile/profilePage";
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
            isLoading: false,
            wsFailed: false
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

                matchStore.getOngoingMatch();

                userStore.getNotifications();

                userStore.getMatchInvitations();

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
                    <Route path="/users/:username" component={ProfilePage}/>
                    <Route render={props => (<div>NotFound</div>)}/>
                </Switch>);
        }
    }

    handleWebsocket(msg) {
        if(_.has(msg,'notification')){
            let notif = userStore.addNotification(msg.notification);

            if (Notification.permission === "granted") {
                var notifObj = new Notification(notif.title);
                setTimeout(notifObj.close.bind(notifObj), 4000);
            }
            userStore.getMatchInvitations();
        }

        if(_.has(msg,'ongoing_match')){
            userStore.getMatchInvitations();
            matchStore.getOngoingMatch();
        }

        if(_.has(msg,'end_match')){
            userStore.getMatchInvitations();
            matchStore.setOngoingMatch(null);
            PlayerService.getPlayers().then((response) => {
                playerStore.setPlayers(response);
            })
        }

        if(_.has(msg,'reject_match')){
            userStore.getMatchInvitations();
        }

        if(_.has(msg,"match_cancelled")){
            matchStore.setOngoingMatch(null);
        }
    }

    websocketConnectionFail() {
        this.setState({wsFailed: true});
    }

    render() {
        return (
            <Layout className="layout">
                <Provider {...stores}>
                    <SockJsClient
                        url={"/ws"}
                        topics={["/user/topic/notify"]}
                        debug={false}
                        onMessage={(msg) => {
                            this.handleWebsocket(msg);
                        }}
                        onConnect={() => {
                            this.setState({wsFailed: false});
                            this.clientRef.sendMessage("/app/register", JSON.stringify({username: userStore.username}));
                        }}
                        onDisconnect={this.websocketConnectionFail.bind(this)}
                        onConnectFailure={this.websocketConnectionFail.bind(this)}
                        ref={(client) => {
                            this.clientRef = client
                        }}/>
                    {this.state.wsFailed ? (<div className="wsFailed"><span>Websocket connection failure. Live update will not work.</span></div>) : ""}
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
