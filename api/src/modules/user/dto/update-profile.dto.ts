import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  username: string;
}
