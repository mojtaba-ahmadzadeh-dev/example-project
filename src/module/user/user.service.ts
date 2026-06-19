import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.utils";

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
}
