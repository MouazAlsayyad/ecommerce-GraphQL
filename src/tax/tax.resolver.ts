import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TaxService } from './tax.service';
import { Tax } from './entities/tax.entity';
import { CreateTaxInput } from './dto/create-tax.input';
import { UpdateTaxInput } from './dto/update-tax.input';
import { Logger } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver(() => Tax)
export class TaxResolver {
  constructor(private readonly taxService: TaxService) {}
  private readonly logger = new Logger(TaxResolver.name);

  @Roles(UserType.ADMIN)
  @Mutation(() => Tax)
  createTax(@Args('createTaxInput') createTaxInput: CreateTaxInput) {
    try {
      return this.taxService.create(createTaxInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => [Tax], { name: 'tax' })
  findAll() {
    try {
      return this.taxService.findAll();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => Tax, { name: 'tax' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.taxService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Tax)
  updateTax(@Args('updateTaxInput') updateTaxInput: UpdateTaxInput) {
    try {
      return this.taxService.update(updateTaxInput.id, updateTaxInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeTax(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.taxService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
