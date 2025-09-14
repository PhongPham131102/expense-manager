import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOTPDto {
    @ApiProperty({
        description: 'Email của người dùng',
        example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty({
        description: 'Mã OTP 6 chữ số',
        example: '123456',
    })
    @IsString({ message: 'Mã OTP phải là chuỗi' })
    @IsNotEmpty({ message: 'Mã OTP không được để trống' })
    @Length(6, 6, { message: 'Mã OTP phải có đúng 6 chữ số' })
    otpCode: string;
}
