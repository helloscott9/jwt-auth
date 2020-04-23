import React, { useState } from 'react'

//antd
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useRegisterMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';


export const Register: React.FC<RouteComponentProps> = ({ history }) => {

    const [register] = useRegisterMutation()

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);


        const response = await register({
            variables: {
                email: values.email,
                password: values.password,
                lastname: "",
                firstname: ""
            }
        }).then((res) => {
            console.log('response:', res)
            history.push('/')
        })

    };

    return (
        <div className="register-container">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Register
                    </Button>
                    Or <a href="">login now!</a>
                </Form.Item>
            </Form>
        </div>
    );
}
