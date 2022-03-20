import { PickType } from '@nestjs/swagger';
import { Workspaces } from 'src/entities/Workspaces';

export class CreateWorkSpaceDto extends PickType(Workspaces, [
  'name',
  'url',
] as const) {}
