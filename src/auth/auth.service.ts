import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(createAuthDto: CreateAuthDto) {
    try {
      const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: createAuthDto.email,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signin(createAuthDto: CreateAuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: createAuthDto.email },
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const isMatch = await bcrypt.compare(
        createAuthDto.password,
        user.password
      );

      if (!isMatch) {
        throw new UnauthorizedException("Invalid password");
      }

      const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return { user: { id: user.id, email: user.email }, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
