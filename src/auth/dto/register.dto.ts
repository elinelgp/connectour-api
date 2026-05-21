import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'artiste@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Str0ngP@ss!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Gravekvlt' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Nantes' })
  @IsOptional()
  @IsString()
  city?: string;
}
