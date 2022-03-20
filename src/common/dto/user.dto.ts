import { ApiProperty, PickType } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';

export class UserDto extends PickType(JoinRequestDto, [
  'email',
  'nickname',
] as const) {
  @ApiProperty({
    required: true,
    example: 1,
    description: '아이디',
  })
  id: number;
}
