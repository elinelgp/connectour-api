import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VenueType } from '../venue.entity';

export class CreateVenueDto {
  @ApiProperty({ example: 'Le Ferrailleur' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Nantes' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ example: '20 quai des Antilles' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 300 })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiPropertyOptional({ enum: VenueType, example: VenueType.CLUB })
  @IsOptional()
  @IsEnum(VenueType)
  type?: VenueType;

  @ApiPropertyOptional({ example: ['metal', 'punk', 'hardcore'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  acceptedGenres?: string[];

  @ApiPropertyOptional({ example: 'Salle emblématique de Nantes' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  typicalFee?: number;

  @ApiProperty({ description: 'UUID du gestionnaire de salle' })
  @IsString()
  managerId!: string;
}
