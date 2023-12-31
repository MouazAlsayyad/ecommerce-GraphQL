import { ObjectType, Field, Int } from '@nestjs/graphql';

import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class Attribute {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}
