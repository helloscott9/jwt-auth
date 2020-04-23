import React from 'react'
import { useByeQuery } from '../generated/graphql';
import { Skeleton } from 'antd';
import { Result, Button } from 'antd';

import { RouteComponentProps } from 'react-router-dom';

export const Bye: React.FC<RouteComponentProps> = () => {
    const { data, error, loading } = useByeQuery({
        fetchPolicy: 'network-only'
    })

    if (error) {
        console.log('error:', error)
        return (
            <Result
                status="500"
                title="500"
                subTitle={error.message.split(":")[1]}
                extra={<Button type="primary">Login</Button>}
            />
        )

    }

    if (loading) {
        return <Skeleton />
    }

    if (!data) {
        return (<div>no data..</div>)
    }

    return (
        <div>{data.bye} </div>
    );
}