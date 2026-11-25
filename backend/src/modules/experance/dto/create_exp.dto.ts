import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsBoolean,
    IsArray,
    IsInt,
    Min,
    IsIn,
  } from 'class-validator';
  
  import { EmploymentType } from '@prisma/client';
  
  export class CreateExperienceDto {
    @IsString()
    @IsNotEmpty()
    company: string;
    
    @IsString()
    @IsNotEmpty()
    position: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    @IsIn(Object.values(EmploymentType))
    employmentType?: EmploymentType;
  
    @IsDateString()
    startDate: string;
  
    @IsOptional()
    @IsDateString()
    endDate?: string;
  
    @IsOptional()
    @IsBoolean()
    current?: boolean;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    projectIds?: string[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: string[];
  
    @IsOptional()
    @IsBoolean()
    featured?: boolean;
  
    @IsOptional()
    @IsBoolean()
    published?: boolean;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
  }