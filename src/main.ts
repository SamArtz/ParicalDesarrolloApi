import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/user.service';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}).join(', '))
          .join('; ');
        return new BadRequestException(messages || 'Invalid request body');
      },
    }),
  );

  const usersService = app.get(UsersService);
  await usersService.create({
    email: 'test@example.com',
    name: 'Juan',
    password: '123456',
  }).catch(() => {});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
