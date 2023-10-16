import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ResetModule } from './reset/reset.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nest_auth',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    ResetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
