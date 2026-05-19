import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import * as venueService from './venue.service';

@ApiTags('Venues')
@Controller('venues')
export class VenueController {
  constructor(private readonly service: venueService.VenueService) {}

  @Get()
  @ApiOperation({ summary: 'Rechercher des salles avec filtres optionnels' })
  @ApiQuery({ name: 'city', required: false, description: 'Ville de la salle' })
  @ApiQuery({
    name: 'minCapacity',
    required: false,
    description: 'Capacité minimale',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'Genre musical accepté',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des salles correspondantes.',
  })
  search(
    @Query('city') city?: string,
    @Query('minCapacity') minCapacity?: string,
    @Query('genre') genre?: string,
  ) {
    const dto: venueService.SearchVenuesDto = {
      city,
      genre,
      // Query params arrivent en string — on convertit explicitement
      minCapacity: minCapacity ? parseInt(minCapacity, 10) : undefined,
    };
    return this.service.search(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une salle" })
  @ApiParam({ name: 'id', description: 'UUID de la salle' })
  @ApiResponse({ status: 404, description: 'Salle introuvable.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une salle (gestionnaire)' })
  @ApiResponse({ status: 201, description: 'Salle créée.' })
  create(@Body() dto: venueService.CreateVenueDto) {
    return this.service.create(dto);
  }
}
