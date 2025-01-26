import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import { CreateGameDto } from './dto/create-game.dto';
import { GameIdParamDto } from './dto/game-id-param.dto';
import { ListGameQueryDto } from './dto/list-game-query.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async create(
    { id }: AdminIdentity,
    {
      title,
      mechanic,
      universalPrice,
      platform,
      store,
      playerBaseCount,
      netCodeType,
      coverPhoto,
      categoryId,
    }: CreateGameDto,
  ) {
    try {
      const game = await this.prisma.game.create({
        data: {
          title,
          mechanic,
          universalPrice,
          platform,
          store,
          playerBaseCount,
          netCodeType,
          coverPhoto,
          categoryId,
          adminId: id,
        },
        select: {
          id: true,
          title: true,
          category: { select: { name: true } },
          createdBy: { select: { name: true } },
        },
      });

      return game;
    } catch (error) {
      throw error;
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    mechanic,
    platform,
    store,
    netCodeType,
    category,
  }: ListGameQueryDto) {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(mechanic && { mechanic }),
      ...(platform && { platform: { has: platform } }),
      ...(store && { store: { has: store } }),
      ...(netCodeType && { netCodeType }),
      ...(category && { category: { name: category } }),
    };

    // Perform both queries in parallel
    const [data, total] = await Promise.all([
      this.prisma.game.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.game.count({
        where,
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return { data, total, limit, page, pages };
  }

  async findOne({ id }: GameIdParamDto) {
    const game = await this.prisma.game.findFirst({
      where: { id, deletedAt: null },
      select: {
        title: true,
        mechanic: true,
        universalPrice: true,
        platform: true,
        store: true,
        playerBaseCount: true,
        netCodeType: true,
        coverPhoto: true,
        timesFavorited: true,
        characters: true,
        guides: true,
        category: { select: { name: true } },
      },
    });

    if (!game) throw new NotFoundException('Game Not Found');
  }

  async update(
    { id }: GameIdParamDto,
    {
      mechanic,
      universalPrice,
      platform,
      store,
      playerBaseCount,
      coverPhoto,
      categoryId,
    }: UpdateGameDto,
  ) {
    const game = await this.prisma.game.findFirst({
      where: { id, deletedAt: null },
    });
    if (!game) throw new NotFoundException('Game Not Found');

    const updatedGame = await this.prisma.game.update({
      where: { id, deletedAt: null },
      data: {
        mechanic,
        universalPrice,
        platform,
        store,
        playerBaseCount,
        coverPhoto,
        categoryId,
      },
    });

    return updatedGame;
  }

  async remove({ id }: GameIdParamDto) {
    const game = await this.prisma.game.findFirst({
      where: { id, deletedAt: null },
    });
    if (!game) throw new NotFoundException('Game Not Found');

    await this.prisma.game.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
