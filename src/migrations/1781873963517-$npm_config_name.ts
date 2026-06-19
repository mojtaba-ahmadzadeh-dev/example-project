import { EntityNames } from "src/common/enum/entity.enum";
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class $npmConfigName1781873963517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================== User Table ====================
    await queryRunner.createTable(
      new Table({
        name: EntityNames.User,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "phone",
            type: "varchar",
            length: "20",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "firstName",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "lastName",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "email",
            type: "varchar",
            length: "150",
            isNullable: true,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "isVerified",
            type: "boolean",
            default: false,
          },
          {
            name: "avatar",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // ==================== Otp Table ====================
    await queryRunner.createTable(
      new Table({
        name: EntityNames.UserOtp,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "code",
            type: "varchar",
            length: "10",
            isNullable: false,
          },
          {
            name: "type",
            type: "enum",
            enum: ["register", "login", "forget_password", "change_phone"],
          },
          {
            name: "expiresAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "isUsed",
            type: "boolean",
            default: false,
          },
          {
            name: "userId",
            type: "int",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // ==================== Foreign Key ====================
    await queryRunner.createForeignKey(
      EntityNames.UserOtp,
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: EntityNames.User,
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      EntityNames.UserOtp,
      "FK_" + EntityNames.UserOtp + "_userId",
    );
    await queryRunner.dropTable(EntityNames.UserOtp);
    await queryRunner.dropTable(EntityNames.User);
  }
}
