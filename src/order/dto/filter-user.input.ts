import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum OrdersOrderBy {
  LowestToHighest,
  HighestToLowest,
  NewOrder,
  OldOrder,
}

registerEnumType(OrdersOrderBy, {
  name: 'OrdersOrderBy',
});

@InputType()
export class WhereOrderFilterDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

@InputType()
export class OrderFilterDTO {
  @Field(() => WhereOrderFilterDTO, { nullable: true })
  @IsOptional()
  @Type(() => WhereOrderFilterDTO)
  filter?: WhereOrderFilterDTO;

  @Field(() => OrdersOrderBy, { nullable: true })
  @IsOptional()
  orderBy?: OrdersOrderBy;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;
}
