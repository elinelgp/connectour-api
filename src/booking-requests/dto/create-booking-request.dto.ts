import {
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProposedDateDto {
  @ApiProperty({ example: '2025-10-15' })
  @IsString()
  start!: string;

  @ApiProperty({ example: '2025-10-16' })
  @IsString()
  end!: string;
}

export class CreateBookingRequestDto {
  @ApiProperty({ description: "UUID de l'artiste" })
  @IsString()
  artistId!: string;

  @ApiProperty({ description: 'UUID de la salle' })
  @IsString()
  venueId!: string;

  @ApiProperty({ example: 'Bonjour, nous aimerions jouer chez vous en octobre.' })
  @IsString()
  message!: string;

  @ApiPropertyOptional({
    type: [ProposedDateDto],
    example: [{ start: '2025-10-15', end: '2025-10-16' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposedDateDto)
  proposedDates?: ProposedDateDto[];
}
