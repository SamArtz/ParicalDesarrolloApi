import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userServices.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const result = await this.userServices.login(loginDto);
    if (!result) throw new UnauthorizedException('Invalid credentials');
    return {
      ok: true,
      token: result.token,
      user: result.user,
    };
  }

}