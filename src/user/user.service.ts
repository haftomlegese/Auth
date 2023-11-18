import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

    async getme(userId: number){
        const info = await this.prisma.user.findUnique({
            where:{
                id: userId
            },
            select:{
                hash:false,
                firstName:true,
                lastName:true,
                email:true
            }
        })
        return info;
    }

    async editUser(userId: number, dto:EditUserDto){
        const user = await this.prisma.user.update({
            where:{
                id:userId
            },
            data: {
                ...dto
            },
            
        })

        return user;
    }
}
