import {
    IsOptional,
    IsInt,
    Min,
    Max,
    IsBoolean,
    IsEnum,
    IsString,
    IsIn,
  } from 'class-validator';
  
  import { Type, Transform } from 'class-transformer';
  import { EmploymentType } from '@prisma/client';
  
  export class ExperienceListDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
  
    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean()
    featured?: boolean;
  
    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean()
    current?: boolean;
  
    @IsOptional()
    @IsIn(Object.values(EmploymentType))
    employmentType?: EmploymentType;
  
    @IsOptional()
    @IsString()
    search?: string;
  
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
  }