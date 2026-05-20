import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVenuesDto {
  @ApiPropertyOptional({ description: 'Ville de la salle', example: 'Nantes' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Capacité minimale', example: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minCapacity?: number;

  @ApiPropertyOptional({
    description: 'Genre musical accepté',
    example: 'metal',
  })
  @IsOptional()
  @IsString()
  genre?: string;
}
