import { LoginDTO, SignInDTO } from '../dtos/auth-dto.interface';
import { AuthEntity } from '../entities/auth-entity.interface';

export interface AuthRepository {
  singIn(data: SignInDTO): Promise<AuthEntity>;
  login(data: LoginDTO): Promise<AuthEntity>;
}
