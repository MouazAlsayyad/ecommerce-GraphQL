import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
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
import { CountryService } from 'src/country/country.service';
import { City, Country, State } from 'src/country/entities/country.entity';
import { Address } from './entities/address.entity';
import { UserFilterDTO } from './dto/filter-user.input';
import { UserIdsDTO } from './dto/block-users.input';
import { UpdateUsersTypeDTO } from './dto/edit-type-users.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly countryService: CountryService,
  ) {}
  private readonly logger = new Logger(UserResolver.name);

  @Roles(UserType.ADMIN)
  @Query(() => [User], { name: 'DashboardUsers' })
  findAllUsers(
    @Args('userFilterDTO', { type: () => UserFilterDTO, nullable: true })
    userFilterDTO: UserFilterDTO,
  ) {
    try {
      return this.userService.getAllUser(userFilterDTO);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  blockUsersByIds(
    @Args('userIdsDTO', { type: () => UserIdsDTO })
    userIdsDTO: UserIdsDTO,
  ) {
    try {
      return this.userService.blockUsersByIds(userIdsDTO);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  unblockUsersByIds(
    @Args('userIdsDTO', { type: () => UserIdsDTO })
    userIdsDTO: UserIdsDTO,
  ) {
    try {
      return this.userService.unblockUsersByIds(userIdsDTO);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  editUserType(
    @Args('updateUsersTypeDTO', { type: () => UpdateUsersTypeDTO })
    updateUsersTypeDTO: UpdateUsersTypeDTO,
  ) {
    try {
      return this.userService.editUserType(updateUsersTypeDTO);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  createUser(
    @Args('createUserInput', { type: () => CreateUserInput })
    createUserInput: CreateUserInput,
  ) {
    try {
      return this.userService.createUser(createUserInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => User)
  findUserById(
    @Args('userId', { type: () => Int })
    userId: number,
  ) {
    try {
      return this.userService.findUserById(userId);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.SELLER, UserType.ADMIN)
  @Query(() => User, { name: 'user' })
  getProfile(@Context() context: ContextType) {
    try {
      return this.userService.findUserById(context.req.user.id);
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

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => User)
  addAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.userService.addAddress(
        createAddressInput,
        context.req.user.id,
      );
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

  @ResolveField(() => [Address])
  address(@Parent() user: User) {
    const { id } = user;
    return this.userService.findAddressesByUserId(id);
  }

  @ResolveField(() => Country)
  country(@Parent() address: Address) {
    const { countryId } = address;
    return this.countryService.findCountryById(countryId);
  }

  @ResolveField(() => State)
  state(@Parent() address: Address) {
    const { stateId } = address;
    return this.countryService.findStateById(stateId);
  }

  @ResolveField(() => City)
  city(@Parent() address: Address) {
    const { cityId } = address;
    return this.countryService.findCityById(cityId);
  }
}
