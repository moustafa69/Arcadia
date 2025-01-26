import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ListGuideQueryDto } from './dto/list-guide-query.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GuideIdParamDto } from './dto/guide-id-param.dto';
import { startCase } from 'lodash';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findAll({ page, limit, authenticAuthor, game }: ListGuideQueryDto) {
    const skip = (page - 1) * limit;
    game = startCase(game);
    const where = {
      deletedAt: null,
      ...(authenticAuthor && { AuthenticAuthor: authenticAuthor }),
      ...(game && { Game: { title: game } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.guide.findMany({
        where,
        skip,
        take: limit,
        select: {
          title: true,
          url: true,
          AuthenticAuthor: true,
          Game: { select: { title: true } },
        },
      }),
      this.prisma.guide.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);
    return { data, total, limit, page, pages };
  }

  async findOne({ id }: GuideIdParamDto) {
    const guide = await this.prisma.guide.findFirst({
      where: { id, deletedAt: null },
      select: {
        title: true,
        gallery: true,
        url: true,
        info: true,
        AuthenticAuthor: true,
        Game: { select: { title: true, timesFavorited: true } },
      },
    });

    if (!guide) throw new NotAcceptableException('Guide Not Found');

    return guide;
  }
}
