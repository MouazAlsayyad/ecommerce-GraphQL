import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';
import {
  AddTagsToProductInput,
  CreateTagInput,
  RemoveTagFromProductInput,
} from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Logger } from '@nestjs/common';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}
  private readonly logger = new Logger(TagResolver.name);
  @Mutation(() => Tag)
  createTag(@Args('createTagInput') createTagInput: CreateTagInput) {
    try {
      return this.tagService.create(createTagInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Mutation(() => Boolean)
  addTagsToProduct(
    @Args('addTagsToProductInput') addTagsToProductInput: AddTagsToProductInput,
  ) {
    try {
      return this.tagService.addTagsToProduct(
        addTagsToProductInput.productTags,
        addTagsToProductInput.productId,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Mutation(() => Boolean)
  removeTagFromProduct(
    @Args('removeTagFromProductInput')
    removeTagFromProductInput: RemoveTagFromProductInput,
  ) {
    try {
      return this.tagService.removeTagFromProduct(
        removeTagFromProductInput.productId,
        removeTagFromProductInput.tagId,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => [Tag], { name: 'tag' })
  findAll() {
    try {
      return this.tagService.findAll();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => Tag, { name: 'tag' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.tagService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Mutation(() => Tag)
  updateTag(@Args('updateTagInput') updateTagInput: UpdateTagInput) {
    try {
      return this.tagService.update(updateTagInput.id, updateTagInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Mutation(() => Boolean)
  removeTag(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.tagService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
