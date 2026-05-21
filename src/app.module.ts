import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { UserModule } from './users/user.module';
import { VenueModule } from './venues/venue.module';
import { BookingRequestsModule } from './booking-requests/booking-request.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(config),
    UserModule,
    AuthModule,
    VenueModule,
    BookingRequestsModule,
  ],
})
export class AppModule {}
