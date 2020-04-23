import React from 'react'
import { Link } from 'react-router-dom'

import { PageHeader, Button, Descriptions, Result } from 'antd';
import { Skeleton } from 'antd';

import { useUsersQuery, useMeQuery } from '../generated/graphql';

interface HomeProps {

}

export const Home: React.FC<HomeProps> = ({ }) => {


    const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' })
    console.log('data:', data)

    if (!data) {
        return <div></div>
    }

    if (loading) {
        return <Skeleton />
    }
    const show = (data: any) => {
        return (
            <div className="site-page-header-ghost-wrapper">
                <PageHeader
                    ghost={false}

                    title="Title"
                    subTitle={data.name}
                    extra={[
                        <Button key="3">Operation</Button>,
                        <Button key="2">Operation</Button>,
                        <Button key="1" type="primary">
                            Primary
                            </Button>,
                    ]}>
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Created"> {data.email} </Descriptions.Item>
                        <Descriptions.Item label="User id ">
                            {data.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
                        <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
                        <Descriptions.Item label="Remarks">
                            Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
                            </Descriptions.Item>
                    </Descriptions>
                </PageHeader>
            </div>
        )
    }

    return (
        <div>
            {data!.users.map(user => {
                return (
                    <div key={user.id}>
                        {show(user)}
                    </div>
                )
            })}
        </div>
    );

}