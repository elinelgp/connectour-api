import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager, ref } from '@mikro-orm/core';
import { BookingRequest, BookingRequestStatus } from './booking-request.entity';
import { User } from '../users/user.entity';
import { Venue } from '../venues/venue.entity';

export interface CreateBookingRequestDto {
  artistId: string;
  venueId: string;
  message: string;
  proposedDates?: { start: string; end: string }[];
}

const ALLOWED_TRANSITIONS: Record<
  BookingRequestStatus,
  BookingRequestStatus[]
> = {
  [BookingRequestStatus.PENDING]: [
    BookingRequestStatus.VIEWED,
    BookingRequestStatus.CANCELLED,
  ],
  [BookingRequestStatus.VIEWED]: [
    BookingRequestStatus.NEGOTIATING,
    BookingRequestStatus.REFUSED,
    BookingRequestStatus.CANCELLED,
  ],
  [BookingRequestStatus.NEGOTIATING]: [
    BookingRequestStatus.CONFIRMED,
    BookingRequestStatus.REFUSED,
    BookingRequestStatus.CANCELLED,
  ],
  [BookingRequestStatus.CONFIRMED]: [],
  [BookingRequestStatus.REFUSED]: [],
  [BookingRequestStatus.CANCELLED]: [],
};

@Injectable()
export class BookingRequestService {
  constructor(
    @InjectRepository(BookingRequest)
    private readonly repo: EntityRepository<BookingRequest>,
    // EntityManager nécessaire pour persist/flush en MikroORM v6
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateBookingRequestDto): Promise<BookingRequest> {
    const br = this.repo.create({
      message: dto.message,
      proposedDates: dto.proposedDates,
      status: BookingRequestStatus.PENDING,
      artist: ref(User, dto.artistId),
      venue: ref(Venue, dto.venueId),
      createdAt: '',
      updatedAt: '',
    });
    await this.em.persistAndFlush(br);
    return br;
  }

  async findAll(): Promise<BookingRequest[]> {
    return this.repo.findAll({ populate: ['venue', 'artist'] });
  }

  async findOne(id: string): Promise<BookingRequest> {
    const br = await this.repo.findOne(
      { id },
      { populate: ['venue', 'artist'] },
    );
    if (!br) throw new NotFoundException(`BookingRequest ${id} introuvable`);
    return br;
  }

  async updateStatus(
    id: string,
    newStatus: BookingRequestStatus,
  ): Promise<BookingRequest> {
    const br = await this.repo.findOne({ id });
    if (!br) throw new NotFoundException(`BookingRequest ${id} introuvable`);

    const allowed = ALLOWED_TRANSITIONS[br.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Transition invalide : ${br.status} → ${newStatus}. ` +
          `Autorisées : ${allowed.join(', ') || 'aucune (état terminal)'}`,
      );
    }

    br.status = newStatus;
    await this.em.flush();
    return br;
  }
}
