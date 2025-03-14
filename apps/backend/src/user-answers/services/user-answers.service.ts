import { Injectable } from '@nestjs/common';
import { UserAnswersQuestionUseCase } from '@flash-me/core/use-cases';
import { UserAnswerRepositoryImpl } from '../infrastructure/relational/repositories/user-answer.repository';
import { SubmitAnswerDto } from '../dtos/submit-answer.dto';
import { AnswerRepositoryImpl } from '../../answers/infrastructure/relational/repositories/answer.repository';
import { UserRepositoryImpl } from '../../users/infrastructure/relational/user.repository';

@Injectable()
export class UserAnswersService {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly userAnswerRepository: UserAnswerRepositoryImpl,
    private readonly answerRepository: AnswerRepositoryImpl,
  ) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto): Promise<void> {
    const useCase = new UserAnswersQuestionUseCase(
      this.userRepository,
      this.userAnswerRepository,
      this.answerRepository,
    );

    await useCase.execute({
      userId: submitAnswerDto.userId,
      questionId: submitAnswerDto.questionId,
      answerId: submitAnswerDto.answerId,
    });
  }
}
