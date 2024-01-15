import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateAddressInput, CreateUserInput } from './dto/create-user.input';
import {
  RemoveAddressInput,
  UpdateAddressInput,
} from './dto/update-user.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { ContextType } from 'src/unit/context-type';
import { Logger } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserResolver.name);
  @Roles(UserType.ADMIN)
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    try {
      return this.userService.create(createUserInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => [User], { name: 'users' })
  findAll() {
    try {
      return this.userService.findAll();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.userService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.userService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER)
  @Mutation(() => User)
  addAddress(
    @Args('addressInput') addressInput: CreateAddressInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.userService.addAddress(addressInput, context.req.user.id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER)
  @Mutation(() => User)
  updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.userService.updateAddress(
        updateAddressInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER)
  @Mutation(() => Boolean)
  deleteAddress(
    @Args('removeAddressInput') removeAddressInput: RemoveAddressInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.userService.deleteAddress(
        removeAddressInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
