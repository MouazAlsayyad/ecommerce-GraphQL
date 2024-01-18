import { Field, InputType, Int } from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

@InputType()
export class UpdateUsersTypeDTO {
  @Field(() => [Int])
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one user ID must be provided' })
  @ArrayUnique({ message: 'User IDs must be unique' })
  @IsInt({ each: true, message: 'User ID must be an integer' })
  @IsPositive({ each: true, message: 'User ID must be a positive integer' })
  usersIds: number[];

  @Field()
  @IsNotEmpty({ message: 'User type must not be empty' })
  @IsEnum(UserType, { message: 'Invalid user type' })
  userType: UserType;
}
