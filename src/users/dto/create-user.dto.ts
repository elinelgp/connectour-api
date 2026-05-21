import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'artiste@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Gravekvlt' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ARTIST })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: 'Nantes' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Evil speed metal punk' })
  @IsOptional()
  @IsString()
  bio?: string;
}
