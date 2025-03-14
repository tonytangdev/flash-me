import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { QuestionRepository } from '@flash-me/core/interfaces/question-repository.interface';
import { Question } from '@flash-me/core/entities';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionMapper } from '../mappers/question.mapper';

@Injectable()
export class QuestionRepositoryImpl implements QuestionRepository {
  private currentEntityManager?: EntityManager;

  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
  ) {}

  setEntityManager(entityManager: EntityManager): void {
    this.currentEntityManager = entityManager;
  }

  async saveQuestions(
    questions: Question[],
    entityManager?: EntityManager,
  ): Promise<void> {
    if (questions.length === 0) return;

    const questionEntities = this.mapQuestionsToEntities(questions);
    const repository = this.getRepository(entityManager);
    await this.persistQuestions(repository, questionEntities);
  }

  async findById(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Question | null> {
    const repository = this.getRepository(entityManager);
    const questionEntity = await repository.findOne({ where: { id } });

    if (!questionEntity) {
      return null;
    }

    return QuestionMapper.toDomain(questionEntity);
  }

  async findAll(entityManager?: EntityManager): Promise<Question[]> {
    const repository = this.getRepository(entityManager);
    const questionEntities = await repository.find();

    return questionEntities.map((entity) => QuestionMapper.toDomain(entity));
  }

  async save(
    question: Question,
    entityManager?: EntityManager,
  ): Promise<Question> {
    const questionEntity = QuestionMapper.toPersistence(question);
    const repository = this.getRepository(entityManager);

    const savedEntity = await repository.save(questionEntity);

    return QuestionMapper.toDomain(savedEntity);
  }

  private mapQuestionsToEntities(questions: Question[]): QuestionEntity[] {
    return questions.map((question) => QuestionMapper.toPersistence(question));
  }

  private getRepository(
    entityManager?: EntityManager,
  ): Repository<QuestionEntity> {
    return entityManager || this.currentEntityManager
      ? (entityManager || this.currentEntityManager!).getRepository(
          QuestionEntity,
        )
      : this.questionRepository;
  }

  private async persistQuestions(
    repository: Repository<QuestionEntity>,
    entities: QuestionEntity[],
  ): Promise<void> {
    await repository.save(entities);
  }
}
