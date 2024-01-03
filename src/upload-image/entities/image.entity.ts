import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
export class UploadImage {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  path: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
