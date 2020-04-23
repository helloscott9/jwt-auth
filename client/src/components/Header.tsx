import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { setAccessToken } from '../accessToken';

interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = ({ }) => {

    const { data, loading } = useMeQuery({ fetchPolicy: 'network-only' })
    const [logout, { client }] = useLogoutMutation();

    let body: any = null;

    if (loading) {
        body = null;
    } else if (data && data.me) {
        body = <div>you are logged in as: {data.me.email}</div>;
    }

    return (
        <header className="header">
            <div className="logo">
                <div><Link to="/">Home</Link> </div>
            </div>

            {!loading && data && data.me ? (
                <div>
                    <Button
                        type="primary"
                        icon={<PoweroffOutlined />}
                        onClick={async () => {
                            await logout();
                            setAccessToken("");
                            await client!.resetStore();
                        }}>
                        logout
                    </Button>
                    {body}
                </div>
            ) : (
                    <div className="nav-item">
                        <div>
                            <Button type="primary"><Link to="/register">Register</Link></Button>
                        </div>
                        <div>
                            <Button><Link to="/login">Login</Link></Button>
                        </div>
                        {/* <div><Link to="/bye">Bye</Link> </div> */}
                    </div>)
            }

        </header>
    );
}