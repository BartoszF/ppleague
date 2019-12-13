import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Icon, Input, notification, } from 'antd';

import './LoginPage.css';
import UserService from '../../services/UserService';
import { ACCESS_TOKEN, APP_NAME } from '../../constants';

const FormItem = Form.Item;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const { validateFields, onLogin } = this.props;
    event.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const loginRequest = { ...values };
        UserService.login(loginRequest)
          .then((response) => {
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            onLogin();
          })
          .catch((error) => {
            if (error.status === 401) {
              notification.error({
                message: APP_NAME,
                description:
                  'Your email or password is incorrect. Please try again!',
              });
            } else {
              notification.error({
                message: APP_NAME,
                description:
                  error.message
                  || 'Sorry! Something went wrong. Please try again!',
              });
            }
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <h1 className="page-title">Login</h1>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your email!',
              },
            ],
          })(
            <Input
              prefix={<Icon type="user" />}
              size="large"
              name="email"
              placeholder="Email"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: 'Please input your Password!'
            }],
          })(
            <Input
              prefix={<Icon type="lock" />}
              size="large"
              name="password"
              type="password"
              placeholder="Password"
            />,
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="login-form-button"
          >
            Login
          </Button>
          Or
          {' '}
          <Link to="/signup">register now!</Link>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({ name: 'login_page' })(LoginPage);
