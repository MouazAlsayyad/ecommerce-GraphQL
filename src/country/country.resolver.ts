import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CountryService } from './country.service';
import { City, Country, State } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import {
  UpdateCityInput,
  UpdateCountryInput,
  UpdateStateInput,
} from './dto/update-country.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver(() => Country)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Roles(UserType.ADMIN)
  @Mutation(() => Country)
  createCountry(
    @Args('createCountryInput') createCountryInput: CreateCountryInput,
  ) {
    return this.countryService.create(createCountryInput);
  }

  @Query(() => [Country], { name: 'country' })
  findAll() {
    return this.countryService.findAll();
  }

  @Query(() => Country, { name: 'country' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.findOne(id);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Country)
  updateCountry(
    @Args('updateCountryInput') updateCountryInput: UpdateCountryInput,
  ) {
    return this.countryService.update(
      updateCountryInput.id,
      updateCountryInput,
    );
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => State)
  updateState(@Args('updateStateInput') updateStateInput: UpdateStateInput) {
    return this.countryService.updateState(
      updateStateInput.id,
      updateStateInput,
    );
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => City)
  updateCity(@Args('updateCityInput') updateCityInput: UpdateCityInput) {
    return this.countryService.updateCity(updateCityInput.id, updateCityInput);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeCountry(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.remove(id);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeState(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.removeState(id);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeCity(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.removeCity(id);
  }

  @ResolveField(() => [State])
  state(@Parent() country: Country) {
    const { id } = country;
    return this.countryService.getStatesByCountryId(id);
  }
}
