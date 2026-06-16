import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createHmac } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secretKey';

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function signJwt(payload: Record<string, any>, secret: string, expiresIn = '1h') {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  let exp = now + 3600;
  if (typeof expiresIn === 'string' && expiresIn.endsWith('m')) {
    exp = now + parseInt(expiresIn, 10) * 60;
  }
  const body = base64UrlEncode(JSON.stringify({ ...payload, iat: now, exp }));
  const signature = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${header}.${body}.${signature}`;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const service = this.userRepository.create(createUserDto);
    return this.userRepository.save(service);
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) return null;
    if (user.password !== loginDto.password) return null;
    const token = signJwt({ sub: user.id, email: user.email }, JWT_SECRET, '1h');
    return { user, token };
  }

}