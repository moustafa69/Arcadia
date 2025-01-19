import { Module } from '@nestjs/common';
import { AdminAppModule } from './modules/admin/admin-app.module';
import { GuideAppModule } from './modules/guide/guide-app.module';
import { UserAppModule } from './modules/user/user-app.module';
import { CharacterAppModule } from './modules/character/character-app.module';
import { GameAppModule } from './modules/game/game-app.module';
import { CategoryAppModule } from './modules/category/category-app.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthAppModule } from './modules/Auth/auth-app.module';
import { RedisModule, RedisModuleOptions } from '@songkeys/nestjs-redis';
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: configService.get('REDIS_HOST') ?? 'redis',
            port: Number(configService.get('REDIS_PORT')),
          },
        };
      },
    }),
    AuthAppModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AdminAppModule,
    UserAppModule,
    GameAppModule,
    CategoryAppModule,
    GuideAppModule,
    CharacterAppModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
