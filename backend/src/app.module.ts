/* eslint-disable class-methods-use-this */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnippetsController } from './snippets/snippets.controller';
import { SnippetsModule } from './snippets/snippets.module';
import { SnippetsService } from './snippets/snippets.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import getDataSourceConfig from './config/data-source.config';
import { HttpsRedirectMiddleware } from './common/https.middleware';
import { EventsModule } from './events/events.module';
import getMailerConfig from './config/mailer.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend/build'),
    }),
    MailerModule.forRoot(getMailerConfig()),
    SnippetsModule,
    UsersModule,
    AuthModule,
    EventsModule,
    TypeOrmModule.forRoot(getDataSourceConfig()),
  ],
  controllers: [
    AppController,
    SnippetsController,
    UsersController,
    AuthController,
  ],
  providers: [AppService, SnippetsService, UsersService, AuthModule],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line no-useless-constructor
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware).forRoutes('*');
  }
}
