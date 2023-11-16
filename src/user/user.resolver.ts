import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import {
  AddressDTO,
  CountryDTO,
  CreateUserInput,
} from './dto/create-user.input';
import { UserType } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ContextType } from 'src/unit/context-type';
import { UpdateAddressDTO } from './dto/update-user.input';
import { FavoritesList } from './entities/favorites-list.entity';
import { Address, Country } from './entities/address.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Roles(UserType.ADMIN)
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Roles(UserType.ADMIN)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => User)
  blockUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.blockUser(id);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }

  @Roles(UserType.USER)
  @Mutation(() => FavoritesList)
  addItemToFavoritesList(
    @Args('itemId', { type: () => Int }) itemId: number,
    @Context() context: ContextType,
  ) {
    return this.userService.addItemToFavoritesList(itemId, context);
  }

  @Roles(UserType.USER)
  @Mutation(() => FavoritesList)
  removeItemFromFavoritesList(
    @Args('itemId', { type: () => Int }) itemId: number,
    @Context() context: ContextType,
  ) {
    return this.userService.removeItemFromFavoritesList(itemId, context);
  }

  @Roles(UserType.USER)
  @Query(() => [FavoritesList])
  getFavoritesList(@Context() context: ContextType) {
    return this.userService.getFavoritesList(context);
  }

  @Roles(UserType.USER)
  @Mutation(() => Address)
  addAddress(
    @Args('addressDTO') addressDTO: AddressDTO,
    @Context() context: ContextType,
  ) {
    return this.userService.addAddress(context, addressDTO);
  }

  @Roles(UserType.USER)
  @Mutation(() => Address)
  updateAddress(
    @Args('addressDTO') addressDTO: UpdateAddressDTO,
    @Context() context: ContextType,
  ) {
    return this.userService.updateAddress(context, addressDTO);
  }

  @Roles(UserType.USER)
  @Mutation(() => Address)
  removeAddress(
    @Args('addressId', { type: () => Int }) addressId: number,
    @Context() context: ContextType,
  ) {
    return this.userService.removeAddress(context, addressId);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Country)
  addCountry(@Args('countryDTO') countryDTO: CountryDTO) {
    return this.userService.addCountry(countryDTO);
  }
}
