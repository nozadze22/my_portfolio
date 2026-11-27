import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  MaxLength,
  Min,
  Matches,
} from "class-validator";
import { SkillCategory } from "@prisma/client";

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @IsOptional()
  @IsEnum(SkillCategory)
  category?: SkillCategory;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
  color?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}