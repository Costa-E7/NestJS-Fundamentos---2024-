import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrate1741196814520 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        unsigned: true
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "63",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "127",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "127",
                        isNullable: false,
                    },
                    {
                        name: "birthAt",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        precision: 6,
                        default: "CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()",
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["1", "2"],
                        default: "'1'",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
