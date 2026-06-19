import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.utils";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { skip, limit, page } = paginationSolver(paginationDto);

    const totalCount = await this.userRepository.count();

    const users = await this.userRepository.find({
      skip,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      pagination: paginationGenerator(totalCount, page, limit),
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`کاربر با آیدی ${id} یافت نشد`);
    }

    return user;
  }
}
