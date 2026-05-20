import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Venue } from './venue.entity';
import { User } from '../users/user.entity';

export interface SearchVenuesDto {
  city?: string;
  minCapacity?: number;
  genre?: string;
}

export interface CreateVenueDto {
  name: string;
  city: string;
  address?: string;
  capacity: number;
  type?: string;
  acceptedGenres?: string[];
  description?: string;
  typicalFee?: number;
  managerId: string;
}

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly repo: EntityRepository<Venue>,
    private readonly em: EntityManager,
  ) {}

  async search(dto: SearchVenuesDto): Promise<Venue[]> {
    const where: FilterQuery<Venue> = { isActive: true };

    if (dto.city) where.city = dto.city;
    if (dto.minCapacity) where.capacity = { $gte: dto.minCapacity };
    if (dto.genre) where.acceptedGenres = { $like: `%${dto.genre}%` };

    return this.repo.find(where, {
      populate: ['manager'],
      orderBy: { capacity: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Venue> {
    const venue = await this.repo.findOne({ id }, { populate: ['manager'] });
    if (!venue) throw new NotFoundException(`Salle ${id} introuvable`);
    return venue;
  }

  async create(dto: CreateVenueDto): Promise<Venue> {
    const { managerId, ...venueData } = dto;

    const venue = this.repo.create({
      ...venueData,
      manager: { id: managerId } as RequiredEntityData<User>,
      isActive: true,
    } as RequiredEntityData<Venue>);

    await this.em.persistAndFlush(venue);
    return venue;
  }
}
