import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BookingRequest } from './booking-request.entity';
import { BookingRequestService } from './booking-request.service';
import { BookingRequestController } from './booking-request.controller';

@Module({
  imports: [MikroOrmModule.forFeature([BookingRequest])],
  controllers: [BookingRequestController],
  providers: [BookingRequestService],
})
export class BookingRequestsModule {}
