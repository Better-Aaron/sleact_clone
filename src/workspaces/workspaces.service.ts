import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  @InjectRepository(Workspaces)
  private workspacesRepository: Repository<Workspaces>;
  @InjectRepository(Channels)
  private channelsRepository: Repository<Channels>;
  @InjectRepository(WorkspaceMembers)
  private workspaceMembersRepository: Repository<WorkspaceMembers>;
  @InjectRepository(ChannelMembers)
  private channelMembersRepository: Repository<ChannelMembers>;
  @InjectRepository(Users)
  private usersRepository: Repository<Users>;

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    // return await this.workspacesRepository
    //   .createQueryBuilder('workspaces')
    //   .leftJoinAndSelect('workspaces.WorkspaceMembers', 'member')
    //   .where('member.Userid=:myId', { myId })
    //   .getMany();

    return this.workspacesRepository
      .createQueryBuilder('workspaces')
      .innerJoin(
        'workspaces.WorkspaceMembers',
        'workspacemembers',
        'workspacemembers.UserId=:id',
        { id: myId },
      )
      .getMany();
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const returned = await this.workspacesRepository.save({
      name: name,
      url: url,
      OwnerId: myId,
    });

    await this.workspaceMembersRepository.save({
      UserId: myId,
      WorkspaceId: returned.id,
    });

    const ChannelReturned = await this.channelsRepository.save({
      name: '일반',
      WorkspaceId: returned.id,
    });
    await this.channelMembersRepository.save({
      UserId: myId,
      ChannelId: ChannelReturned.id,
    });
  }

  async getWorkspaceMembers(url: string) {
    return (
      this.usersRepository
        .createQueryBuilder('user')
        // .innerJoin('user.WorkspaceMembers', 'members')
        // .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
          url,
        })
        .getMany()
    );
  }
}
