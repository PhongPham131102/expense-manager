export class TransactionResponseDto {
  id: string;
  userId: string;
  amount: number;
  category: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  isIncome: boolean;
  note: string;
  date: Date;
  time: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
