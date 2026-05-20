import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export enum UserRole {
  ARTIST = 'artist',
  VENUE_MANAGER = 'venue_manager',
  ORGANIZER = 'organizer',
  PENDING = 'pending',
}

@Entity({ tableName: 'app_user' })
export class User {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property({ unique: true })
  email!: string;

  @Property()
  name!: string;

  @Property()
  role: UserRole = UserRole.PENDING;

  @Property({ nullable: true })
  city?: string;

  @Property({ nullable: true })
  bio?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
