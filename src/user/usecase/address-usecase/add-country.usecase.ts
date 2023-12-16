import { UseCase, UserRepository } from 'lib/types/src';
import { CountryInput } from '../../dto/create-user.input';

export class AddCountryUseCase implements UseCase<CountryInput, Promise<void>> {
  constructor(private userRepository: UserRepository) {}

  execute(data: CountryInput): Promise<void> {
    this.userRepository.addCountry(data);
    return;
  }
}
