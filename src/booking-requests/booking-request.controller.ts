import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import * as bookingRequestService from './booking-request.service';
import { BookingRequestStatus } from './booking-request.entity';

class UpdateStatusDto {
  status!: BookingRequestStatus;
}

@ApiTags('Booking Requests')
@Controller('booking-requests')
export class BookingRequestController {
  constructor(
    private readonly service: bookingRequestService.BookingRequestService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une demande de contact artiste → salle' })
  @ApiBody({
    schema: {
      example: {
        artistId: 'uuid-artiste',
        venueId: 'uuid-salle',
        message: 'Bonjour, nous aimerions jouer chez vous en octobre.',
        proposedDates: [
          { start: '2025-10-15', end: '2025-10-16' },
          { start: '2025-10-22', end: '2025-10-23' },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Demande créée avec statut PENDING.',
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() dto: bookingRequestService.CreateBookingRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister toutes les demandes (avec venue et artiste)',
  })
  @ApiResponse({ status: 200, description: 'Liste des demandes.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Récupérer le détail d'une demande" })
  @ApiParam({ name: 'id', description: 'UUID de la demande' })
  @ApiResponse({ status: 200, description: 'Détail de la demande.' })
  @ApiResponse({ status: 404, description: 'Demande introuvable.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Changer le statut via la machine à états métier' })
  @ApiParam({ name: 'id', description: 'UUID de la demande' })
  @ApiBody({
    schema: {
      example: { status: 'viewed' },
      enum: Object.values(BookingRequestStatus),
    },
  })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 400, description: 'Transition de statut invalide.' })
  @ApiResponse({ status: 404, description: 'Demande introuvable.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
