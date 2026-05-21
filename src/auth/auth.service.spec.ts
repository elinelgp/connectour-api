import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { User, UserRole } from '../users/user.entity';

const mockUserService: jest.Mocked<
  Pick<UserService, 'findByEmail' | 'create'>
> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService: jest.Mocked<Pick<JwtService, 'sign'>> = {
  sign: jest.fn(),
};

const fakeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-uuid',
    email: 'test@test.com',
    name: 'Test User',
    password: 'hashed-password',
    role: UserRole.ARTIST,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as User;

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(
      mockUserService as unknown as UserService,
      mockJwtService as unknown as JwtService,
    );
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('doit créer un user et retourner un access_token', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(fakeUser());
      mockJwtService.sign.mockReturnValue('signed-token');

      const result = await service.register({
        email: 'test@test.com',
        password: 'Test1234!',
        name: 'Test User',
      });

      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@test.com' }),
      );
      expect(result).toEqual({ access_token: 'signed-token' });
    });

    it('doit hasher le mot de passe avant de persister', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(fakeUser());
      mockJwtService.sign.mockReturnValue('signed-token');

      await service.register({
        email: 'test@test.com',
        password: 'Test1234!',
        name: 'Test User',
      });

      const createCall = mockUserService.create.mock.calls[0][0] as Partial<User>;
      expect(createCall.password).not.toBe('Test1234!');
      expect(createCall.password).toBeDefined();
      const isHashed = await bcrypt.compare('Test1234!', createCall.password!);
      expect(isHashed).toBe(true);
    });

    it('doit lever ConflictException si l\'email est déjà utilisé', async () => {
      mockUserService.findByEmail.mockResolvedValue(fakeUser());

      await expect(
        service.register({
          email: 'test@test.com',
          password: 'Test1234!',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);

      expect(mockUserService.create).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('doit retourner un access_token si les credentials sont valides', async () => {
      const hash = await bcrypt.hash('Test1234!', 1);
      mockUserService.findByEmail.mockResolvedValue(fakeUser({ password: hash }));
      mockJwtService.sign.mockReturnValue('signed-token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'Test1234!',
      });

      expect(result).toEqual({ access_token: 'signed-token' });
    });

    it('doit lever UnauthorizedException si le mot de passe est incorrect', async () => {
      const hash = await bcrypt.hash('AutrePass!', 1);
      mockUserService.findByEmail.mockResolvedValue(fakeUser({ password: hash }));

      await expect(
        service.login({ email: 'test@test.com', password: 'MauvaisPass!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('doit lever UnauthorizedException si l\'utilisateur n\'existe pas', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'inconnu@test.com', password: 'Test1234!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('doit renvoyer le même message d\'erreur que l\'user existe ou non (anti-enumération)', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      const errorUnknownUser = await service
        .login({ email: 'inconnu@test.com', password: 'Test1234!' })
        .catch((e: UnauthorizedException) => e.message);

      const hash = await bcrypt.hash('AutrePass!', 1);
      mockUserService.findByEmail.mockResolvedValue(fakeUser({ password: hash }));
      const errorBadPassword = await service
        .login({ email: 'test@test.com', password: 'MauvaisPass!' })
        .catch((e: UnauthorizedException) => e.message);

      expect(errorUnknownUser).toBe(errorBadPassword);
    });
  });
});
