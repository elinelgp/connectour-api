import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { SearchVenuesDto } from './dto/search-venues.dto';

@ApiTags('Venues')
@Controller('venues')
export class VenueController {
  constructor(private readonly service: VenueService) {}

  @Get()
  @ApiOperation({ summary: 'Rechercher des salles avec filtres optionnels' })
  @ApiResponse({
    status: 200,
    description: 'Liste des salles correspondantes.',
  })
  search(@Query() dto: SearchVenuesDto) {
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
  create(@Body() dto: CreateVenueDto) {
    return this.service.create(dto);
  }
}
