import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create.dto.js';


export class UpdateProjectDto extends PartialType(CreateProjectDto) {}