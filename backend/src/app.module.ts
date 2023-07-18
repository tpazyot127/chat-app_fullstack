import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { connectDB } from './utils/config';
import { ChatModule } from './gptChat/chat.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: connectDB,
		}),
		UsersModule,
		ChatModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
