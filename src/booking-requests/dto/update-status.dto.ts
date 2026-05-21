import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingRequestStatus } from '../booking-request.entity';

export class UpdateStatusDto {
  @ApiProperty({
    enum: BookingRequestStatus,
    example: BookingRequestStatus.VIEWED,
    description: 'Nouveau statut (doit respecter la machine à états)',
  })
  @IsEnum(BookingRequestStatus)
  status!: BookingRequestStatus;
}
