import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { User } from '@flash-me/core/entities';

@Injectable()
export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const user = new User({
      id: entity.id,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
    return user;
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.getId();
    entity.email = domain.getEmail();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.deletedAt = domain.getDeletedAt();
    return entity;
  }
}
