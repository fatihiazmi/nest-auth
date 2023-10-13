import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcryptjs from 'bcryptjs';

@Controller('api')
export class UserController {

    constructor(private userService: UserService){}

    @Post('register')
    async register(@Body() body:any){
        if(body.password !== body.password_confirm){
            throw new BadRequestException('Passwords do not match!')
        }


        return this.userService.save({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: await bcryptjs.hash(body.password,12),
        });
    }

    @Post('login')
    async login(
        @Body('email') email:string,
        @Body('password') password: string
        ){
            const user = await this.userService.findOneBy({email})

            if(!user){
                throw new BadRequestException('Invalid email or password')
            }

            if(await bcryptjs.compare(password, user.password)){
                throw new BadRequestException('Invalid email or password')
            }

            return user;
        }
}
