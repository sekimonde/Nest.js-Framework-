import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [CommonModule, 
            UsersModule, 
            TodoModule,
            TypeOrmModule.forRoot(typeOrmConfig),
          
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
