import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeFirebase } from './firebase/firebase.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initializeFirebase()
  
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();