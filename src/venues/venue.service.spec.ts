import { Venue } from './venue.entity';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { VenueService } from './venue.service';

const mockRepo: jest.Mocked<
  Pick<EntityRepository<Venue>, 'find' | 'findOne' | 'findAll'>
> = {
  find: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

const mockEm: jest.Mocked<Pick<EntityManager, 'persistAndFlush'>> = {
  persistAndFlush: jest.fn(),
};

describe('VenuesService', () => {
  let service: VenueService;

  beforeEach(() => {
    service = new VenueService(
      mockRepo as unknown as EntityRepository<Venue>,
      mockEm as unknown as EntityManager,
    );
    jest.clearAllMocks();
  });

  describe('search()', () => {
    it('doit retourner toutes les salles actives sans filtre', async () => {
      const fakeVenues = [
        { id: 'v1', name: 'Le Ferrailleur', city: 'Nantes', isActive: true },
        { id: 'v2', name: 'La Maison', city: 'Nantes', isActive: true },
      ] as Venue[];

      mockRepo.find.mockResolvedValue(fakeVenues);

      const result = await service.search({});

      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: true }),
        expect.anything(),
      );
      expect(result).toHaveLength(2);
    });

    it('doit filtrer par ville', async () => {
      mockRepo.find.mockResolvedValue([]);

      await service.search({ city: 'Nantes' });

      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ city: 'Nantes', isActive: true }),
        expect.anything(),
      );
    });

    it('doit filtrer par capacité minimale', async () => {
      mockRepo.find.mockResolvedValue([]);

      await service.search({ minCapacity: 200 });

      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
          capacity: { $gte: 200 },
        }),
        expect.anything(),
      );
    });

    it('doit filtrer par genre musical accepté', async () => {
      mockRepo.find.mockResolvedValue([]);

      await service.search({ genre: 'metal' });

      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
          acceptedGenres: { $like: '%metal%' },
        }),
        expect.anything(),
      );
    });
  });

  describe('findOne()', () => {
    it('doit retourner une salle par son ID', async () => {
      const fakeVenue = { id: 'v1', name: 'Le Ferrailleur' } as Venue;
      mockRepo.findOne.mockResolvedValue(fakeVenue);

      const result = await service.findOne('v1');

      expect(result).toEqual(fakeVenue);
    });

    it('doit lever une NotFoundException si la salle est introuvable', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
