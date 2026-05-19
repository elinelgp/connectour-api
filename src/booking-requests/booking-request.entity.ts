import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Enum,
  type Ref,
} from '@mikro-orm/core';
import { User } from '../users/user.entity';
import { Venue } from '../venues/venue.entity';

export enum BookingRequestStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  NEGOTIATING = 'negotiating',
  CONFIRMED = 'confirmed',
  REFUSED = 'refused',
  CANCELLED = 'cancelled',
}

@Entity()
export class BookingRequest {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Enum(() => BookingRequestStatus)
  status: BookingRequestStatus = BookingRequestStatus.PENDING;

  @Property({ type: 'text' })
  message!: string;

  @Property({ type: 'json', nullable: true })
  proposedDates?: { start: string; end: string }[];

  @Property({ type: 'text', nullable: true })
  responseMessage?: string;

  @ManyToOne(() => User)
  artist!: Ref<User>;

  @ManyToOne(() => Venue)
  venue!: Ref<Venue>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
