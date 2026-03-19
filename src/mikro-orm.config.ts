import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { User } from './users/user.entity';
import { Venue } from './venues/venue.entity';
import { BookingRequest } from './booking-requests/booking-request.entity';

export default defineConfig({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT || 5433),
  dbName: process.env.DB_NAME ?? 'connectour_db',
  user: process.env.DB_USER ?? 'connectour_user',
  password: process.env.DB_PASSWORD ?? 'connectour_pass',
  entities: [User, Venue, BookingRequest],
  extensions: [Migrator],
  migrations: {
    path: 'src/migrations',
    pathTs: 'src/migrations',
  },
  debug: process.env.NODE_ENV === 'development',
});
