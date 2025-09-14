import { IsNumber, Min, Max } from 'class-validator';

export class SetInitialBalanceDto {
  @IsNumber()
  @Min(0)
  @Max(999999999999)
  initialBalance: number;
}
