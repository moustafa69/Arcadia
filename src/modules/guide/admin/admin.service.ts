import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import { ListGuideQueryDto } from './dto/list-guide-query.dto';
import { GuideIdParamDto } from './dto/guide-id-param.dto';
import { GalleryDto } from './dto/gallery.dto';
import { startCase } from 'lodash';
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async create(
    { id }: AdminIdentity,
    { title, gallery, url, info, authenticAuthor, gameId }: CreateGuideDto,
  ) {
    try {
      const guide = await this.prisma.guide.create({
        data: {
          title,
          gallery,
          url,
          info,
          AuthenticAuthor: authenticAuthor,
          gameId,
          authorId: id,
        },
        select: { title: true, url: true, Game: { select: { title: true } } },
      });

      return guide;
    } catch (error) {
      throw error;
    }
  }

  async findAll({ page, limit, authenticAuthor, game }: ListGuideQueryDto) {
    const skip = (page - 1) * limit;
    game = startCase(game);

    const where = {
      deletedAt: null,
      ...(authenticAuthor && { AuthenticAuthor: authenticAuthor }),
      ...(game && { game: { title: game } }),
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

  async update(
    { id }: GuideIdParamDto,
    { title, gallery, url, info }: UpdateGuideDto,
  ) {
    try {
      const updatedGuide = await this.prisma.guide.update({
        where: { id, deletedAt: null },
        data: { title, url, info, gallery },
        select: {
          title: true,
          url: true,
          gallery: true,
          info: true,
          Game: { select: { title: true, timesFavorited: true } },
        },
      });
      return updatedGuide;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Game Not Found');
      }
      throw error;
    }
  }

  async remove({ id }: GuideIdParamDto) {
    try {
      await this.prisma.guide.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Game Not Found');
      }
      throw error;
    }
  }

  async addToGallery({ id }: GuideIdParamDto, { gallery }: GalleryDto) {
    try {
      const updatedGuide = await this.prisma.guide.update({
        where: { id },
        data: {
          gallery: {
            push: gallery,
          },
        },
      });
      return updatedGuide;
    } catch (error) {
      throw error;
    }
  }

  async removeFromGallery({ id }: GuideIdParamDto, { gallery }: GalleryDto) {
    try {
      const guide = await this.prisma.guide.findUnique({
        where: { id },
      });
      if (!guide) throw new NotFoundException('Guide not found');

      const updatedGallery = guide.gallery.filter(
        (url) => !gallery.includes(url),
      );

      const updatedGuide = await this.prisma.guide.update({
        where: { id },
        data: { gallery: updatedGallery },
      });

      return updatedGuide;
    } catch (error) {
      throw error;
    }
  }
}
