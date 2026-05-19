import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  type Ref,
} from '@mikro-orm/core';
import { User } from '../users/user.entity';

export enum VenueType {
  CLUB = 'club',
  THEATER = 'theater',
  BAR = 'bar',
  FESTIVAL = 'festival',
  OTHER = 'other',
}

@Entity()
export class Venue {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  name!: string;

  @Property()
  city!: string;

  @Property({ nullable: true })
  address?: string;

  @Property()
  capacity!: number;

  @Property()
  type: VenueType = VenueType.CLUB;

  @Property({ type: 'array', nullable: true })
  acceptedGenres: string[] = [];

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  typicalFee?: number;

  @Property()
  isActive: boolean = true;

  @ManyToOne(() => User)
  manager!: Ref<User>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
