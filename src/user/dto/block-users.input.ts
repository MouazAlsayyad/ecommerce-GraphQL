import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsPositive,
} from 'class-validator';

@InputType()
export class UserIdsDTO {
  @Field(() => [Int])
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one user ID must be provided' })
  @ArrayUnique({ message: 'User IDs must be unique' })
  @IsInt({ each: true, message: 'User ID must be an integer' })
  @IsPositive({ each: true, message: 'User ID must be a positive integer' })
  usersIds: number[];
}
