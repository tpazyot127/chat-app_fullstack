import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './utils/config';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { sessionConfig } from './utils/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';

const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors(corsConfig());
	app.use(session(sessionConfig(MongoDBStore)));
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	await app.listen(process.env.CLIENT_URL === 'DEV' ? 4000 : 3000, '0.0.0.0'); 
}
bootstrap();