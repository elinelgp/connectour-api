import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Récupérer un utilisateur par ID" })
  @ApiParam({ name: 'id', description: "UUID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé.' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: "UUID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour.' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }
}
