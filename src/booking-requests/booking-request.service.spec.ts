import { BookingRequest, BookingRequestStatus } from './booking-request.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import {
  BookingRequestService,
  CreateBookingRequestDto,
} from './booking-request.service';

const mockRepo: jest.Mocked<
  Pick<EntityRepository<BookingRequest>, 'create' | 'findOne' | 'findAll'>
> = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

const mockEm: jest.Mocked<Pick<EntityManager, 'persistAndFlush' | 'flush'>> = {
  persistAndFlush: jest.fn(),
  flush: jest.fn(),
};

describe('BookingRequestsService', () => {
  let service: BookingRequestService;

  beforeEach(() => {
    service = new BookingRequestService(
      mockRepo as unknown as EntityRepository<BookingRequest>,
      mockEm as unknown as EntityManager,
    );
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('doit créer une demande avec statut PENDING', async () => {
      const dto: CreateBookingRequestDto = {
        artistId: 'artist-uuid',
        venueId: 'venue-uuid',
        message: 'On aimerait jouer chez vous en octobre',
        proposedDates: [{ start: '2025-10-15', end: '2025-10-16' }],
      };

      const fakeBR: Partial<BookingRequest> = {
        id: 'br-uuid',
        status: BookingRequestStatus.PENDING,
        message: dto.message,
      };

      mockRepo.create.mockReturnValue(fakeBR as BookingRequest);
      mockEm.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: BookingRequestStatus.PENDING }),
      );
      expect(result.status).toBe(BookingRequestStatus.PENDING);
    });
  });

  describe('updateStatus()', () => {
    it('doit passer de PENDING à VIEWED', async () => {
      const fakeBR = {
        id: 'br-uuid',
        status: BookingRequestStatus.PENDING,
      } as BookingRequest;
      mockRepo.findOne.mockResolvedValue(fakeBR);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await service.updateStatus(
        'br-uuid',
        BookingRequestStatus.VIEWED,
      );

      expect(result.status).toBe(BookingRequestStatus.VIEWED);
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('doit refuser une transition illégale (CONFIRMED → PENDING)', async () => {
      const fakeBR = {
        id: 'br-uuid',
        status: BookingRequestStatus.CONFIRMED,
      } as BookingRequest;
      mockRepo.findOne.mockResolvedValue(fakeBR);

      await expect(
        service.updateStatus('br-uuid', BookingRequestStatus.PENDING),
      ).rejects.toThrow(BadRequestException);
    });

    it("doit lever une NotFoundException si la demande n'existe pas", async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('id-inexistant', BookingRequestStatus.VIEWED),
      ).rejects.toThrow(NotFoundException);
    });

    it("doit permettre à l'artiste d'annuler une demande PENDING", async () => {
      const fakeBR = {
        id: 'br-uuid',
        status: BookingRequestStatus.PENDING,
      } as BookingRequest;
      mockRepo.findOne.mockResolvedValue(fakeBR);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await service.updateStatus(
        'br-uuid',
        BookingRequestStatus.CANCELLED,
      );

      expect(result.status).toBe(BookingRequestStatus.CANCELLED);
    });
  });
});
