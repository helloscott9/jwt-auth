import React from 'react'

//antd
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { RouteComponentProps } from 'react-router-dom';
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { setAccessToken } from '../accessToken';



export const Login: React.FC<RouteComponentProps> = ({ history }) => {


    const [login] = useLoginMutation()
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);

        const response = await login({
            variables: {
                email: values.email,
                password: values.password
            },
            update: (store, { data }) => {
                if (!data) {
                    return null
                }
                //update cache
                store.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                        me: data.login.user
                    }

                })
            }
        }).then((res) => {
            console.log('response:', res)

            setAccessToken(res.data!.login.accessToken)
            history.push('/')
        }).catch((err) => {
            console.log('err:', err)
            let m = err.message.split(':')[1]
            message.error(m, 5)
        })

    };

    return (


        <div>
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
                            Log in
                    </Button>
                    Or <a href="">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </div>

    );
}