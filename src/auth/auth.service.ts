import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      this.logger.warn(`Registration refused for existing email ${dto.email}`);
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: UserRole.ARTIST,
      city: dto.city,
    });

    this.logger.log(`User registered with artist role: ${user.id}`);

    return this.buildToken(user);
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`Login failed for unknown email ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      this.logger.warn(`Login failed for user ${user.id}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.id}`);

    return this.buildToken(user);
  }

  private buildToken(user: User): { access_token: string } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
