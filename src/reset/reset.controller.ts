import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { ResetService } from './reset.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';

@Controller()
export class ResetController {
  constructor(
    private resetService: ResetService,
    private mailerService: MailerService,
    private userService: UserService,
  ) {}

  @Post('forgot')
  async forgot(
    @Body('email') email: string,
    @Res({ passthrough: true }) response: Response
    ) {
    const token = Math.random().toString(20).substring(2, 12);

    await this.resetService.save({
      email,
      token,
    });

    const frontendUrl = `http://localhost:8080/#/reset/${token}`;

    const user = await this.userService.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot Password?',
      html: `Click <a href="${frontendUrl}">${token}</a> to reset your password!`,
    });

    response.status(200)
    return {
      message: 'Check your email now!',
    };
  }

  @Post('reset')
  async reset(
    @Body('token') token: string,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const reset = await this.resetService.findOneBy({ token });

    const user = await this.userService.findOneBy({ email: reset.email });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.userService.update(user.id, {
      password: await bcryptjs.hash(password, 12),
    });

    return {
      message: 'Your password has been reset',
    };
  }
}
