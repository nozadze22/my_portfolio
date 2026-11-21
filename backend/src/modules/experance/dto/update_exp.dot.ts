import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienceDto } from './create_exp.dto.js';

export class UpdateExperienceDto extends PartialType(
  CreateExperienceDto,
) {}