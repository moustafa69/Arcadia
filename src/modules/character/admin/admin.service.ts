import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { ListCharacterQueryDto } from './dto/list-all-characters-query.dto';
import { CharacterIdParamDto } from './dto/character-id-param.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { title } from 'process';
import { Archetype } from '@prisma/client';
import { startCase } from 'lodash';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async create({
    name,
    splashArt,
    tierList,
    baseRooster,
    description,
    archetype,
    showcase,
    photo,
    gameId,
  }: CreateCharacterDto) {
    try {
      const character = await this.prisma.character.create({
        data: {
          name,
          splashArt,
          tierList,
          baseRooster,
          description,
          archetype,
          showcase,
          photo,
          gameId,
        },
        select: {
          name: true,
          splashArt: true,
          archetype: true,
          game: { select: { title: true } },
        },
      });
      return character;
    } catch (error) {
      throw error;
    }
  }

  async findAll({
    page,
    limit,
    archetype,
    tierList,
    game,
  }: ListCharacterQueryDto) {
    const skip = (page - 1) * limit;
    game = startCase(game);
    const where = {
      deletedAt: null,
      ...(archetype && { archetype: archetype as Archetype }),
      ...(tierList && { tierList }),
      ...(game && { game: { title: game } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.character.findMany({ where, skip, take: limit }),
      ,
      this.prisma.character.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);
    return { data, total, limit, page, pages };
  }

  async findOne({ id }: CharacterIdParamDto) {
    const character = await this.prisma.character.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        splashArt: true,
        tierList: true,
        baseRooster: true,
        description: true,
        archetype: true,
        showcase: true,
        photo: true,
        game: { select: { title: true } },
      },
    });

    if (!character) throw new NotFoundException('Character Not Found');
    return character;
  }

  async update(
    { id }: CharacterIdParamDto,
    {
      name,
      splashArt,
      tierList,
      baseRooster,
      description,
      archetype,
      showcase,
      photo,
      gameId,
    }: UpdateCharacterDto,
  ) {
    try {
      const updatedCharacter = await this.prisma.character.update({
        where: { id, deletedAt: null },
        data: {
          name,
          splashArt,
          tierList,
          baseRooster,
          description,
          archetype,
          showcase,
          photo,
          gameId,
        },
        select: {
          name: true,
          splashArt: true,
          archetype: true,
          tierList: true,
          game: { select: { title: true, timesFavorited: true } },
        },
      });
      return updatedCharacter;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Character Not Found');
      }
      throw error;
    }
  }

  async remove({ id }: CharacterIdParamDto) {
    try {
      await this.prisma.character.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Character Not Found');
      }
      throw error;
    }
  }
}
