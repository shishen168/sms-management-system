import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateInitialTables1708543200000 implements MigrationInterface {
    name = 'CreateInitialTables1708543200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(255) NOT NULL UNIQUE,
                balance DECIMAL(10,2) NOT NULL DEFAULT '0.00',
                isVerified BOOLEAN NOT NULL DEFAULT false,
                createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id)
            )
        `)

        await queryRunner.query(`
            CREATE TABLE sms_records (
                id INT NOT NULL AUTO_INCREMENT,
                phone VARCHAR(255) NOT NULL,
                code VARCHAR(255) NOT NULL,
                type ENUM('register', 'login', 'reset') NOT NULL,
                isUsed BOOLEAN NOT NULL DEFAULT false,
                expireTime DATETIME NOT NULL,
                createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                userId INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `)

        await queryRunner.query(`
            CREATE TABLE recharge_records (
                id INT NOT NULL AUTO_INCREMENT,
                amount DECIMAL(10,2) NOT NULL,
                paymentMethod ENUM('alipay', 'wechat', 'card') NOT NULL,
                status ENUM('pending', 'completed', 'failed') NOT NULL,
                transactionId VARCHAR(255),
                createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                userId INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `)

        await queryRunner.query(`
            CREATE TABLE orders (
                id INT NOT NULL AUTO_INCREMENT,
                orderNumber VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL,
                metadata JSON,
                createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                userId INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE orders`)
        await queryRunner.query(`DROP TABLE recharge_records`)
        await queryRunner.query(`DROP TABLE sms_records`)
        await queryRunner.query(`DROP TABLE users`)
    }
}