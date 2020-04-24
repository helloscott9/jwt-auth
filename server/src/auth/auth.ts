import { User } from './../entity/User';
import { sign } from 'jsonwebtoken';

export const createAccessToken = async (user: User) => {
    return sign({
        userId: user.id
    }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" })
}

export const createRefreshToken = async (user: User) => {
    return sign({
        userId: user.id, tokenVersion: user.tokenVersion
    }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" })
}