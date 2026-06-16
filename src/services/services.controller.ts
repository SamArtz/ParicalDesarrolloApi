import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, Headers } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { createHmac } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secretKey';

function base64UrlDecode(value: string) {
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

function verifyJwt(token: string) {
  if (!token) throw new UnauthorizedException('Missing token');
  const parts = token.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedException('Invalid authorization header');
  }
  const [header, payload, signature] = parts[1].split('.');
  if (!header || !payload || !signature) throw new UnauthorizedException('Invalid token');

  const expectedSignature = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  if (signature !== expectedSignature) throw new UnauthorizedException('Invalid token signature');

  const data = JSON.parse(base64UrlDecode(payload));
  if (data.exp && Math.floor(Date.now() / 1000) > data.exp) {
    throw new UnauthorizedException('Token expired');
  }
  return data;
}

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @Headers('authorization') authorization: string,
  ) {
    const jwtPayload = verifyJwt(authorization);
    const userId = jwtPayload.sub;
    return this.servicesService.create(createServiceDto, userId);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
