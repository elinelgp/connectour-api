import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'artiste@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Str0ngP@ss!' })
  @IsString()
  password!: string;
}
