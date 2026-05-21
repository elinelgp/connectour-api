import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { VenueModule } from './venues/venue.module';
import { BookingRequestsModule } from './booking-requests/booking-request.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    UserModule,
    VenueModule,
    BookingRequestsModule,
  ],
})
export class AppModule {}
