import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';
import { CategoryIdParamDto } from './dto/category-id-param.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(
    { id }: AdminIdentity,
    { name, description, parentId }: CreateCategoryDto,
  ) {
    const category = await this.prisma.category.create({
      data: {
        name,
        description,
        createdById: id,
        parentId,
      },
    });

    return category;
  }

  async findAll(): Promise<Partial<Category>[]> {
    const catgeories: Partial<Category>[] = await this.prisma.category.findMany(
      {
        where: { deletedAt: null },
        select: { id: true, name: true, description: true },
      },
    );
    if (!catgeories.length)
      throw new NotFoundException('Category List is Empty');
    return catgeories;
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

  async update(
    { id }: CategoryIdParamDto,
    { name, description, parentId }: UpdateCategoryDto,
  ) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
    if (!category) throw new NotFoundException('Category Not Found');

    const updatedCategory: Partial<Category> =
      await this.prisma.category.update({
        where: { id, deletedAt: null },
        data: { name, description, parentId },
        select: {
          id: true,
          name: true,
          description: true,
          createdById: true,
          createdAt: true,
          parentId: true,
        },
      });
    return updatedCategory;
  }

  async remove({ id }: CategoryIdParamDto) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
    if (!category) throw new NotFoundException('Category Not Found');

    await this.prisma.category.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
