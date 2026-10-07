import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppController } from './app.controller.js';

@Module({ controllers: [AppController] })
class AppModule {}

const app = await NestFactory.create(AppModule);
await app.listen(3000);
console.log('Try: curl -N --max-time 3 http://localhost:3000/sse');
