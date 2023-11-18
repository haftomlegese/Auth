import { ForbiddenException, Injectable } from "@nestjs/common";

import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { async } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
// import {User , Bookmark} from "@prisma/client";

@Injectable({})


export class AuthService {
    constructor(private prisma: PrismaService ,private jwt:JwtService, private config: ConfigService) {

    }
    async signup(dto: AuthDto) {

        try {
            // generate hashed password
            const hash = await argon.hash(dto.password);
            //save user
            const user = await this.prisma.user.create({
                data:
                {
                    email: dto.email,
                    hash
                },
                // select: {
                //     email: true,
                //     id: true,
                //     createdAt: true
                // }
            })
            // detlete user.hash;
            // return saved user
            return this.signToken(user.id,user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }
    }
    async signin(dto: AuthDto) {
        // find user by email
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        })
        // throw error if the user is not registred
        if(!user){
            throw new ForbiddenException('crendential not found')
        }

        // match password
        const pwMatched = await argon.verify(user.hash, dto.password)

        // if password is incorrect throw error
        if(!pwMatched){
            throw new ForbiddenException('incorrect password')
        }
        // delete user.hash;
        return this.signToken(user.id,user.email);
    }

    async signToken(userId: number, email: string,): Promise<{access_token:string}>{
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload,{
            expiresIn: '2d',
            secret:secret
        })

        return {
            access_token:token
        }
    }

}