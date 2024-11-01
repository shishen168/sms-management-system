import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateRolesAndPermissions1708543300000 implements MigrationInterface {
    name = 'CreateRolesAndPermissions1708543300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建权限表
        await queryRunner.query(`
            CREATE TABLE permissions (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL UNIQUE,
                description VARCHAR(255),
                createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id)
            )
        `)

        // 创建角色表
        await queryRunner.query(`
            CREATE TABLE roles (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL UNIQUE,
                description VARCHAR(255),
                createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (id)
            )
        `)

        // 创建用户角色关联表
        await queryRunner.query(`
            CREATE TABLE user_roles (
                userId INT NOT NULL,
                roleId INT NOT NULL,
                PRIMARY KEY (userId, roleId),
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE
            )
        `)

        // 创建角色权限关联表
        await queryRunner.query(`
            CREATE TABLE role_permissions (
                roleId INT NOT NULL,
                permissionId INT NOT NULL,
                PRIMARY KEY (roleId, permissionId),
                FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
            )
        `)

        // 添加默认角色
        await queryRunner.query(`
            INSERT INTO roles (name, description) VALUES
            ('admin', '系统管理员'),
            ('user', '普通用户')
        `)

        // 添加默认权限
        await queryRunner.query(`
            INSERT INTO permissions (name, description) VALUES
            ('user:manage', '管理用户'),
            ('user:view', '查看用户'),
            ('recharge:manage', '管理充值'),
            ('order:manage', '管理订单')
        `)

        // 为管理员角色分配所有权限
        await queryRunner.query(`
            INSERT INTO role_permissions (roleId, permissionId)
            SELECT 1, id FROM permissions
        `)

        // 为普通用户角色分配基本权限
        await queryRunner.query(`
            INSERT INTO role_permissions (roleId, permissionId)
            SELECT 2, id FROM permissions WHERE name IN ('user:view')
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE role_permissions`)
        await queryRunner.query(`DROP TABLE user_roles`)
        await queryRunner.query(`DROP TABLE roles`)
        await queryRunner.query(`DROP TABLE permissions`)
    }
}