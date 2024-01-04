import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTagInput: CreateTagInput) {
    return this.prisma.$transaction((tx) => {
      return tx.tag.create({
        data: { value: createTagInput.value.toLowerCase() },
      });
    });
  }

  findOrCreateTag(value: string): Promise<number> {
    return this.prisma.$transaction(async (tx) => {
      const tag = await tx.tag.findFirst({ where: { value } });
      if (tag) return tag.id;
      const newTag = await tx.tag.create({ data: { value } });
      return newTag.id;
    });
  }

  async addTagsToProduct(productTags: string[], productId: number) {
    const allData = await Promise.all(
      productTags.map(async (value) => {
        const tagId = await this.findOrCreateTag(value.toLowerCase());
        return { productId, tagId };
      }),
    );
    const existingProductTags = await this.prisma.product_Tag.findMany({
      where: {
        OR: allData.map(({ productId, tagId }) => ({ productId, tagId })),
      },
    });

    const data = allData.filter(({ productId, tagId }) => {
      return !existingProductTags.some(
        (existingTag) =>
          existingTag.productId === productId && existingTag.tagId === tagId,
      );
    });

    if (data.length > 0) await this.prisma.product_Tag.createMany({ data });

    return true;
  }

  findAllTagsByProductId(productId: number): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      where: { product_tag: { some: { productId } } },
    });
  }

  async removeTagFromProduct(productId: number, tagId: number) {
    await this.prisma.product_Tag.delete({
      where: { tagId_productId: { productId, tagId } },
    });

    return true;
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  findOne(id: number) {
    return this.prisma.$transaction((tx) => {
      return tx.tag.findUnique({ where: { id } });
    });
  }

  update(id: number, updateTagInput: UpdateTagInput) {
    return this.prisma.$transaction(async (tx) => {
      const tag = await this.findOne(id);
      if (!tag) throw new NotFoundException(`There is no tag with ${id}`);

      return tx.tag.update({
        where: { id },
        data: { value: updateTagInput.value.toLowerCase() },
      });
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const tag = await this.findOne(id);
      if (!tag) throw new NotFoundException(`There is no tag with ${id}`);

      await tx.product_Tag.deleteMany({ where: { tagId: id } });
      await tx.tag.delete({ where: { id } });
      return true;
    });
  }
}
