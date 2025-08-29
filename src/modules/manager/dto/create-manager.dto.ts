import { ApiProperty } from '@nestjs/swagger';

export class CreateManagerDto {
  @ApiProperty({ description: "The farmer's first name", example: 'John' })
  firstName: string;

  @ApiProperty({ description: "The farmer's last name", example: 'Doe' })
  lastName: string;

  @ApiProperty({
    description: "The farmer's email",
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: "The farmer's phoneNumber",
    example: '08012345678',
  })
  phoneNumber: string;

  @ApiProperty({
    description: "The farmer's address",
    example: '123 Main St',
  })
  address: string;
}
