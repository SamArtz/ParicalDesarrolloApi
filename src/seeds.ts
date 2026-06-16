import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  // Crear usuario de prueba
  const user = await usersService.create({
    email: 'test@example.com',
    name: 'Juan',
    password: '123456',
  });

  console.log('Usuario creado:', user);
  await app.close();
}

bootstrap();