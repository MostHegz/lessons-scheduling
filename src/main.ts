import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Constants } from './common/constants';
import { SuccessResponseInterceptor } from './utilities';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // TODO: Enable cors only for trusted frontend urls
  app.enableCors();

  app.connectMicroservice({ transport: Transport.TCP });

  const config = new DocumentBuilder()
    .setTitle(Constants.API_TITLE)
    .addTag(Constants.API_TAG)
    .addBearerAuth({
      type: Constants.API_AUTH_TYPE as any,
      scheme: Constants.API_AUTH_SCHEMA,
      bearerFormat: Constants.API_AUTH_BEARER_FORMAT,
      in: Constants.API_AUTH_PATH
    },
      Constants.API_AUTH_NAME)
    .build();
  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, options);
  await app.startAllMicroservicesAsync();
  await app.listen(3001);

  logger.log(`App is listening on port 3001`);
  logger.log(`Check API documentation here ===> http://localhost:3001/swagger`);
}
bootstrap();
