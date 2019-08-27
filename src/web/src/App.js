import React from 'react';
import './App.css';
import {Provider} from "mobx-react";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import playerStore from "./stores/playerStore";
import LadderPage from "./pages/ladderPage/ladderPage";
import {Layout, Menu} from "antd";
const { Header, Content, Footer } = Layout;

const stores = {playerStore}

function App() {
    return (
        <Layout className="layout">
            <Provider {...stores}>
                <Router>
                    <Header>
                        <div className="logo"/>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{padding: '0 50px'}}>
                        <Switch>
                            <Route path="/" component={LadderPage}/>
                        </Switch>
                    </Content>
                </Router>
            </Provider>
        </Layout>
    );
}

export default App;
