import { Injectable, NotFoundException } from '@nestjs/common';
import { GameIdParamDto } from './dto/game-id-param.dto';
import { ListGameQueryDto } from './dto/list-game-query.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotFoundError } from 'rxjs';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
        select: { ...this.selectStage },
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
      select: { ...this.selectStage },
    });

    if (!game) throw new NotFoundException('Game Not Found');
    return game;
  }

  async findGameCharacters({ id }: GameIdParamDto) {
    const game = await this.prisma.game.findFirst({
      where: { id, deletedAt: null },
      select: { characters: true },
    });

    if (!game) throw new NotFoundException('Game Not Found');
    return game;
  }

  async findGameGuides({ id }: GameIdParamDto) {
    const game = await this.prisma.game.findFirst({
      where: { id, deletedAt: null },
      select: { guides: true },
    });

    if (!game) throw new NotFoundException('Game Not Found');
    return game;
  }

  private selectStage = {
    title: true,
    mechanic: true,
    universalPrice: true,
    platform: true,
    store: true,
    playerBaseCount: true,
    netCodeType: true,
    coverPhoto: true,
    timesFavorited: true,
    category: { select: { name: true } },
    createdBy: { select: { name: true } },
  };
}
