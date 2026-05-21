import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingRequestService } from './booking-request.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Booking Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('booking-requests')
export class BookingRequestController {
  constructor(private readonly service: BookingRequestService) {}

  @Post()
  @Roles(UserRole.ARTIST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une demande de contact artiste → salle' })
  @ApiResponse({
    status: 201,
    description: 'Demande créée avec statut PENDING.',
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 403, description: 'Rôle ARTIST requis.' })
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
  @Roles(UserRole.VENUE_MANAGER)
  @ApiOperation({ summary: 'Changer le statut via la machine à états métier' })
  @ApiParam({ name: 'id', description: 'UUID de la demande' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 400, description: 'Transition de statut invalide.' })
  @ApiResponse({ status: 403, description: 'Rôle VENUE_MANAGER requis.' })
  @ApiResponse({ status: 404, description: 'Demande introuvable.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
