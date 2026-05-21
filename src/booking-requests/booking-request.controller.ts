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
} from '@nestjs/swagger';
import { BookingRequestService } from './booking-request.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Booking Requests')
@Controller('booking-requests')
export class BookingRequestController {
  constructor(private readonly service: BookingRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une demande de contact artiste → salle' })
  @ApiResponse({
    status: 201,
    description: 'Demande créée avec statut PENDING.',
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() dto: CreateBookingRequestDto) {
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
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 400, description: 'Transition de statut invalide.' })
  @ApiResponse({ status: 404, description: 'Demande introuvable.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
