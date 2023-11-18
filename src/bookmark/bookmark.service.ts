import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    async createBookmark(userId:number, dto:CreateBookmarkDto){
        await this.prisma.bookmark.create({
            data:{
                userId,
                ...dto
            }
        });
        return {message:"Bookmark created successfully"}
    }

    getBookmark(userId:number){
        const result = this.prisma.bookmark.findMany({
            where:{
                userId
            },
            select:{
                id:true,
                title:true,
                Description:true,
                link:true,
                userId:true
            }
        })
        return result;
    }

    getBookmarkById(userId:number, bookmarkId:number){
        return this.prisma.bookmark.findFirst({
            where:{
                id:bookmarkId,
                userId
            },
            select:{
                id:true,
                title:true,
                Description:true,
                link:true,
                userId:true
            }
        })

    }

    async updateBookmarkById(userId:number,bookmarkId:number,dto:EditBookmarkDto ){
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })

        if(!bookmark || bookmark.userId !== userId){
            throw new ForbiddenException("Access to resource denied")
        }

        return this.prisma.bookmark.update({
            where:{
                id:bookmarkId
            },
            data:{
                ...dto
            },
            select:{
                id:true,
                title:true,
                Description:true,
                link:true,
                userId:true
            }
        })
    }

    async deleteBookmarkById(userId:number,bookmarkId:number){
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })

        if(!bookmark || bookmark.userId !== userId){
            throw new ForbiddenException("Access to resource denied")
        }

        await this.prisma.bookmark.delete({
            where:{
                id:bookmarkId
            }
        })
    }
}
