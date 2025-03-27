import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, effect, signal  } from '@angular/core';
import { QuizService } from '../../services/quiz.service';

interface CreateAnswerDto {
  answerText: string;
  isCorrect: boolean;
}

interface CreateQuestionDto {
  questionText: string;
  answers: CreateAnswerDto[];
}

interface CreateQuizDto {
  title: string;
  description?: string;
  questions: CreateQuestionDto[];
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, HttpClientModule],
  providers: [QuizService],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {
  quiz = signal<CreateQuizDto>({
    title: '',
    description: '',
    questions: [
      ...Array(5).fill(0).map(() => ({
        questionText: '',
        answers: [
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
        ],
      })),
    ],
  });

  constructor(private quizService: QuizService) {
   effect(() => {
      console.log('Quiz data changed:', this.quiz());
    });
  }

  onTitleChange(event: Event) {
    const newTitle = (event.target as HTMLInputElement).value;
    this.quiz.update(current => ({
      ...current,
      title: newTitle,
    }));
  }

  onDescriptionChange(event: Event) {
    const newDescription = (event.target as HTMLTextAreaElement).value;
    this.quiz.update(current => ({
      ...current,
      description: newDescription,
    }));
  }

  onQuestionTextChange(event: Event, qIndex: number) {
    const newText = (event.target as HTMLInputElement).value;
    this.quiz.update(current => {
      const questions = [...current.questions];
      questions[qIndex] = {
        ...questions[qIndex],
        questionText: newText,
      };
      return { ...current, questions };
    });
  }

  onAnswerTextChange(event: Event, qIndex: number, aIndex: number) {
    const newText = (event.target as HTMLInputElement).value;
    this.quiz.update(current => {
      const questions = [...current.questions];
      const answers = [...questions[qIndex].answers];
      answers[aIndex] = { ...answers[aIndex], answerText: newText };
      questions[qIndex] = { ...questions[qIndex], answers };
      return { ...current, questions };
    });
  }

  onAnswerCorrectChange(event: Event, qIndex: number, aIndex: number) {
    const newVal = (event.target as HTMLInputElement).checked;
    this.quiz.update(current => {
      const questions = [...current.questions];
      const answers = [...questions[qIndex].answers];
      answers[aIndex] = { ...answers[aIndex], isCorrect: newVal };
      questions[qIndex] = { ...questions[qIndex], answers };
      return { ...current, questions };
    });
  }

  createQuiz() {
    const quizData = this.quiz();
    if (!quizData.title) {
      alert('Title is required');
      return;
    }
    this.quizService.createQuiz(quizData).subscribe({
      next: (res) => {
        alert('Quiz created successfully!');
        this.quiz.set({
          title: '',
          description: '',
          questions: [
            ...Array(5).fill(0).map(() => ({
              questionText: '',
              answers: [
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
              ],
            })),
          ],
        });
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to create quiz');
      },
    });
  }

}
