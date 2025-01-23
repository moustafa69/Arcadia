import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryIdParamDto } from './dto/category-id-param.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data: Partial<Category>[] = await this.prisma.category.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, description: true },
    });

    if (!data) throw new NotFoundException('Category List is Empty');

    return data;
  }

  async findOne({ id }: CategoryIdParamDto) {
    const category: Partial<Category>[] = await this.prisma.category.findMany({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        createdBy: { select: { name: true } },
        parent: { select: { id: true, name: true, description: true } },
        subcategories: { select: { id: true, name: true, description: true } },
      },
    });

    if (!category) throw new NotFoundException('Category Not Found');

    return category;
  }

  async findSubs({ id }: CategoryIdParamDto) {
    try {
      const categoryTree = await this.prisma.$queryRaw<
        {
          id: number;
          name: string;
          parentId: number | null;
          description: string | null;
        }[]
      >(
        Prisma.sql`
        WITH RECURSIVE CategoryTree AS (
          SELECT id, name, "parentId", description
          FROM "Category" 
          WHERE id = ${id}
          UNION ALL
          SELECT c.id, c.name, c."parentId", c.description
          FROM "Category" c
          INNER JOIN CategoryTree ct ON c."parentId" = ct.id
        )
        SELECT * FROM CategoryTree;
        `,
      );

      return categoryTree;
    } catch (error) {
      console.error('Error fetching category subtree:', error);
      throw new Error('Failed to fetch category subtree');
    }
  }
}
