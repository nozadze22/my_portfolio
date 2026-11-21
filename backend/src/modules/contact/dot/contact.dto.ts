

import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class CreateContactDto {
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    fullName!: string;
  
    @IsEmail()
    @MaxLength(254)
    email!: string;
  
    @IsString()
    @MinLength(9)
    @MaxLength(30)
    @Matches(/^\+?[0-9\s()-]+$/)
    phone!: string;

    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    message!: string;
  }
  