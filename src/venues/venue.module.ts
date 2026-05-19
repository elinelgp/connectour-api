import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Venue } from './venue.entity';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Venue])],
  controllers: [VenueController],
  providers: [VenueService],
})
export class VenueModule {}
