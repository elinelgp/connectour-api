import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from './../src/auth/auth.controller';
import { AuthService } from './../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('/auth/register (POST)', () => {
    authService.register.mockResolvedValue({ access_token: 'signed-token' });

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'artist@example.com',
        password: 'StrongPass1!',
        name: 'Artist',
        city: 'Nantes',
      })
      .expect(201)
      .expect({ access_token: 'signed-token' });
  });

  it('/auth/login (POST) returns 400 on invalid payload', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'artist@example.com' })
      .expect(400);
  });
});
