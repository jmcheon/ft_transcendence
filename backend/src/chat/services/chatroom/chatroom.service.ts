import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEventsGateway } from 'src/chat/chat.events.gateway';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { ChatContent, ChatMember, Chatroom, User } from 'src/typeorm';
import { IChatroom } from 'src/typeorm/interfaces/IChatroom';
import { DataSource, Repository } from 'typeorm';
import { IChatroomService } from './chatroom.interface';
import * as bcrypt from 'bcrypt';
import { ChatroomDto } from 'src/chat/dto/chatroom.dto';

@Injectable()
export class ChatroomService implements IChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
    @InjectRepository(ChatMember)
    private chatMemebrRepository: Repository<ChatMember>,
    @InjectRepository(ChatContent)
    private chatContentRepository: Repository<ChatContent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private chatEventsGateway: ChatEventsGateway,
  ) {}

  async findChatroomByIdOrFail(chatroomId: number) {
    // return await this.chatroomRepository.findOneBy({ chatroomId });
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_id=:chatroomId', { chatroomId })
      .getOne();
    if (!chatroom) {
      console.log(`findChatroomByIdOrFail of id: ${chatroomId} not found,`);
      throw new NotFoundException(`Chatroom of id:${chatroomId} not found`);
    }
    return chatroom;
  }

  async findChatroomByNameOrFail(chatroomName: string) {
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_name=:chatroomName', { chatroomName })
      .getOne();
    if (!chatroom) {
      console.log(
        `findChatroomByNameOrFail of id: '${chatroomName}' not found,`,
      );
      throw new NotFoundException(`Chatroom of id:${chatroomName} not found`);
    }
    return chatroom;
  }

  async findChatroomByName(chatroomName: string) {
    return await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_name=:chatroomName', { chatroomName })
      .getOne();
  }

  async getChatroomsInfo(chatrooms: IChatroom[]) {
    return await Promise.all(
      (
        await chatrooms
      ).map((chatroom: any) => {
        if (chatroom.password !== null) chatroom.isPrivate = true;
        else chatroom.isPrivate = false;
        const { password, createdAt, modifiedAt, ...result } = chatroom;
        return result;
      }),
    );
  }

  hashData(data: string) {
    return bcrypt.hash(data, 11);
  }

  async getAllChatrooms(): Promise<ChatroomDto[]> {
    const chatrooms = await this.chatroomRepository.find();
    return await this.getChatroomsInfo(chatrooms);
  }

  async createChatroom(
    userId: number,
    createChatroomDto: CreateChatroomDto,
  ): Promise<ChatroomDto> {
    // console.log('password:', createChatroomDto.password);
    // console.log('typeof userId:', userId, typeof userId);
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    // const queryRunner = this.dataSource.createQueryRunner();
    // queryRunner.connect();
    const { chatroomName, password } = createChatroomDto;
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .addSelect('chatroom.password')
      .where('chatroom.chatroom_name = :chatroomName', { chatroomName })
      .getOne();
    if (chatroom)
      // console.log(`Chatroom of name: ${chatroomName} already exists`);
      throw new BadRequestException(
        `Chatroom of name: '${chatroomName}' already exists`,
      );

    const hashedPassword =
      password !== null
        ? await this.hashData(createChatroomDto.password)
        : null;
    // console.log('hashedPassword:', hashedPassword);
    const newChatroom = this.chatroomRepository.create({
      ownerId: userId,
      chatroomName,
      password: hashedPassword,
    });
    const createdChatroom = await this.chatroomRepository.save(newChatroom);
    const chatroomMemebr = this.chatMemebrRepository.create({
      userId: userId,
      chatroomId: createdChatroom.chatroomId,
      Chatroom: newChatroom,
      User: user,
    });
    await this.chatMemebrRepository.save(chatroomMemebr);
    this.chatEventsGateway.server.emit('newRoomList', 'chatroom created');
    console.log(newChatroom);
    const result = await this.getChatroomsInfo([newChatroom]);
    return result[0];

    // const chatroomContent = this.chatContentRepository.create({
    //   chatroomId,
    //   userId,
    //   Chatroom: chatroom,
    //   User: user,
    // });

    // const chatroom = this.chatroomRepository.createQueryBuilder('chatroom');
    //   .innerJoinAndSelect();
    // return this.chatroomRepository.save(chatroom);
  }
  async getOneChatroom(chatroomId: number): Promise<ChatroomDto> {
    // console.log('getOneChatroom() typeof chatroomId:', typeof chatroomId);
    // const chatroom = await this.chatroomRepository
    //   .createQueryBuilder('chatroom')
    //   .leftJoinAndSelect(
    //     'chatroom.ChatMember',
    //     'chat_member',
    //     'chat_member.chatroom_id=chatroom_id',
    //     { chatroomId },
    //   );
    // const chatroom = await this.chatroomRepository.findOne({
    //   where: {
    //     chatroomId: chatroomId,
    //   },
    //   relations: ['ChatMember'],
    // });
    const chatroom = await this.findChatroomByIdOrFail(chatroomId);
    console.log('current chatroom info:', chatroom);
    const result = await this.getChatroomsInfo([chatroom]);
    return result[0];
  }
  getAllMembers(chatroomId: number) {
    console.log('test', typeof chatroomId, chatroomId);
    return (
      this.chatMemebrRepository
        .createQueryBuilder('chat_member')
        // .select('chat_member.userId')
        .innerJoin(
          'chat_member.Chatroom',
          'chatroom',
          'chatroom.chatroom_id = :chatroomId',
          { chatroomId },
        )
        // .select('user.username')
        .innerJoinAndSelect('chat_member.User', 'user')
        // .select('user.username')
        .getMany()
    );
    // return this.userRepository
    //   .createQueryBuilder('users')
    //   .innerJoin(
    //     'users.Chatroom',
    //     'chatroom',
    //     'chatroom.chatroom_name=:chatroomName',
    //     { chatroomName },
    //   )
    //   .getMany();
  }
  async postMembers(userId: number, chatroomId: number) {
    const chatroom = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.chatroom_id=:chatroom_id', { chatroomId })
      .getOne();
    if (!chatroom)
      throw new NotFoundException(`Chatroom of id: ${chatroomId} not found`);
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:user_id', { userId })
      .getOne();
    if (!user) throw new NotFoundException(`User not found`);
    const chatroomMember = this.chatMemebrRepository.create({
      userId,
      chatroomId,
    });
    await this.chatMemebrRepository.save(chatroomMember);
  }
  // updateChatroom() {
  //   throw new Error('Method not implemented.');
  // }
  getContents() {
    throw new Error('Method not implemented.');
  }
  postContents() {
    throw new Error('Method not implemented.');
  }
}
