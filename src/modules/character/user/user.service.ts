import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ListCharacterQueryDto } from './dto/list-all-characters-query.dto';
import { startCase } from 'lodash';
import { Archetype } from '@prisma/client';
import { CharacterIdParamDto } from './dto/character-id-param.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
}
