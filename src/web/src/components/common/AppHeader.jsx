import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './AppHeader.css';
import { Badge, Dropdown, Icon, Layout, Menu, } from 'antd';
import { inject, observer } from 'mobx-react';

import Notification from './notification';

const { Header } = Layout;

@inject('userStore') @inject('matchStore') @observer
class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.userStore = this.props.userStore;
  }

  handleMenuClick({ key }) {
    if (key === 'logout') {
      this.props.onLogout();
    }
  }

  render() {
    let menuItems;
    if (this.props.userStore.isAuthenticated) {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" className="noselect nav-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/notifications" className="noselect notifications-menu">
          <NotificationsDropdown
            handleMenuClick={this.handleMenuClick}
            userStore={this.props.userStore}
            count={this.props.userStore.notifications.length}
          />
        </Menu.Item>,
        <Menu.Item key="/profile" className="noselect profile-menu">
          <ProfileDropdownMenu
            currentUser={this.props.userStore}
            handleMenuClick={this.handleMenuClick}
          />
        </Menu.Item>,
      ];
    } else {
      menuItems = [
        <Menu.Item key="/login">
          <Link className="noselect" to="/login">Login</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link className="noselect" to="/signup">Signup</Link>
        </Menu.Item>,
      ];
    }

    return (
      <Header className="app-header">
        <div className="container">
          <div className="app-title">
            <Link className="noselect" to="/">League</Link>
          </div>
          <Menu
            className="app-menu"
            mode="horizontal"
            theme="dark"
            selectedKeys={[this.props.location.pathname]}
            style={{ lineHeight: '64px' }}
          >
            {menuItems}
          </Menu>
        </div>
      </Header>
    );
  }
}

function getNotification(notification) {
  return (
    <div key={`not_${notification.id}`} className="dropdown-item">
      <Notification notification={notification}/>
    </div>
  );
}

function NotificationsDropdown(props) {
  const dropdownMenu = (
    <Menu theme="light" className="notifications-dropdown-menu">

      {props.userStore.notifications.length > 0 ? props.userStore.notifications.map((notification) => getNotification(notification)) : (
        <div className="noselect noNotifications">
          Bag of notifications is empty
          <Icon type="smile"/>
        </div>
      )}

    </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      placement="bottomCenter"
      trigger={['click']}
      getPopupContainer={() => document.getElementsByClassName('notifications-menu')[0]}
    >
      <div href="#" className="ant-dropdown-link">
        <Badge title="Notifications" count={props.count} overflowCount={10}>
          <Icon type="alert" className="nav-icon"/>
        </Badge>
      </div>
    </Dropdown>
  );
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu theme="light" onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/public/users/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
                Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}
    >
      <div className="ant-dropdown-link">
        <Icon type="user" className="nav-icon" style={{ marginRight: 0 }}/>
        <Icon type="down"/>
      </div>
    </Dropdown>
  );
}


export default withRouter(AppHeader);
