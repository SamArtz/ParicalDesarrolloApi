import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity'
import { Service } from './services/entities/service.entity'


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',            
      database: 'db.sqlite',
      entities: [User, Service],
      synchronize: true,          
    }),
    UsersModule,
    ServicesModule,
    AuthModule,
  ],
})
export class AppModule {}
