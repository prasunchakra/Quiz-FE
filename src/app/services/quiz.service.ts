import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private readonly baseUrl = 'http://localhost:3000/quizzes';

  constructor(private http: HttpClient) {}

  createQuiz(quizData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, quizData);
  }
}
