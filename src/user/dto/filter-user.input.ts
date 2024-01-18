import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum UserOrderBy {
  AToZByName,
  ZToAByName,
  AToZByEmail,
  ZToAByEmail,
  NewUser,
  OldUser,
}

registerEnumType(UserOrderBy, {
  name: 'UserOrderBy',
});

@InputType()
export class WhereUserFilterDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isBlock?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;
}

@InputType()
export class UserFilterDTO {
  @Field(() => WhereUserFilterDTO, { nullable: true })
  @IsOptional()
  @Type(() => WhereUserFilterDTO)
  filter?: WhereUserFilterDTO;

  @Field(() => UserOrderBy, { nullable: true })
  @IsOptional()
  orderBy?: UserOrderBy;

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
