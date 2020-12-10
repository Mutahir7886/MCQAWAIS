import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminQuizService {

  unsavedQuiz = new Subject();
  unsavedQuizObservable = this.unsavedQuiz.asObservable();

  constructor(private afStore: AngularFirestore) {
  }

  getUnsavedQuizObservable(): Observable<any> {
    return this.unsavedQuizObservable;
  }

  getDBasJSON(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('quizzes').valueChanges()
        .subscribe((quizzes: any) => {
          this.afStore.collection('questions').valueChanges()
            .subscribe((questions: any) => {
              this.afStore.collection('answers').valueChanges()
                .subscribe((answers: any) => {
                  console.log('in getDBasJSON');
                  // console.log(quizzes);
                  // console.log(questions);
                  const dataToReturn = JSON.parse(JSON.stringify(quizzes));
                  for (let i = 0; i < quizzes.length; i++) {
                    // console.log(quiz);

                    const requiredQuestions = questions.filter(q => quizzes[i].questions_ids.includes(q.qid));
                    const requiredAnswers = answers.filter(a => quizzes[i].questions_ids.includes(a.qid));
                    questions = questions.filter(q => !quizzes[i].questions_ids.includes(q.qid));

                    delete dataToReturn[i].questions_ids;
                    dataToReturn[i].questions = requiredQuestions;
                    dataToReturn[i].answers = requiredAnswers;

                    // console.log(requiredQuestions);
                    // console.log(questions);
                  }

                  resolve(dataToReturn);
                }, (answersError) => {
                  reject(answersError);
                });

            }, (questionsError) => {
              reject(questionsError);
            });

        }, (quizzesError) => {
          reject(quizzesError);
        });
    });
  }

  insertDB(data): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      console.log('CSV:', data);
      const rows = data.split('\r\n');
      rows.splice(0, 1);
      console.log('CSV:', rows[0].split(','));
      console.log('CSV:', rows[1].split(','));
      console.log('CSV:', rows[2].split(','));

      let currentQuizName = rows[0].split(',')[0];

      let quiz: any = [];
      for (const row of rows) {
        const properties = row.split(',');
        console.log('properties', properties);
        if (properties.length === 7) {
          quiz.quiz_name = currentQuizName;
          if (properties[0] !== currentQuizName) {
            await this.uploadQuiz(quiz);
            quiz = [];
            currentQuizName = properties[0];
            quiz.quiz_name = currentQuizName;
          }

          const question: any = {};
          question.statement = properties[1];
          question.options = [];
          for (let i = 2; i < 6; i++) {
            if (properties[i]) {
              question.options.push(properties[i]);
            }
          }
          question.answer = properties[6];
          quiz.push(question);
        }
      }

      await this.uploadQuiz(quiz);
      resolve();
    });
  }

  // Return array of string values, or NULL if CSV string not well formed.
  CSVtoArray(text): any[] {
    console.log('in CSVtoArray', text);
    const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) {
      return null;
    }

    const a = []; // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
      (m0, m1, m2, m3) => {

        // Remove backslash from \' in single quoted values.
        if (m1 !== undefined) {
          a.push(m1.replace(/\\'/g, '\''));
        }// Remove backslash from \" in double quoted values.
        else if (m2 !== undefined) {
          a.push(m2.replace(/\\"/g, '"'));
        } else if (m3 !== undefined) {
          a.push(m3);
        }
        return ''; // Return empty string.
      });

    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) {
      a.push('');
    }
    return a;
  }

  // updateDB(data: any): Promise<any> {
  //   return new Promise<any>(async (resolve, reject) => {
  //     this.getDBasJSON()
  //       .then((initialDB) => {
  //         // console.log('localData', data);
  //         // console.log('initialDB:', initialDB);
  //
  //         // console.log('CSV:', data);
  //         const rows = data.split('\r\n');
  //         rows.splice(0, 1);
  //         // console.log('rows', rows);
  //         // for (const row of rows) {
  //         //   console.log(row);
  //         // }
  //
  //         const localQuizIds = rows.map(row => row.split(',')[0]);
  //         // console.log(localQuizIds);
  //
  //
  //         const batch = this.afStore.firestore.batch();
  //         // check which changes are made in each quiz
  //         // let currentQuizId = initialDB[0].quiz_id.toString();
  //         for (const quiz of initialDB) {
  //           // ================== check if quiz was deleted ========================
  //           if (localQuizIds.includes(quiz.quiz_id.toString())) {
  //             console.log('quiz was not deleted');
  //
  //             // ======================== generate quiz from localData ========================
  //             const currentQuiz: any = [];
  //             currentQuiz.quiz_id = quiz.quiz_id;
  //             for (let j = 0; j < rows.length; j++) {
  //               // const properties = this.CSVtoArray(rows[j]);
  //               // console.log('rows[j]', rows[j]);
  //
  //               if (rows[j]) {
  //                 // console.log('in if');
  //                 const intermediateProperties = rows[j].split('`');
  //                 const statement = intermediateProperties[1];
  //                 let properties = intermediateProperties[0].split(',');
  //                 properties.splice(3, 1);
  //                 properties = properties.concat(intermediateProperties[2].split(','));
  //                 properties[3] = statement;
  //                 properties.length = 9;
  //                 // console.log('properties', properties);
  //                 if (properties[0] === quiz.quiz_id.toString()) {
  //                   // console.log('lkjasdf');
  //                   currentQuiz.quiz_name = properties[1];
  //                   // this means that this row belongs to the currentQuiz
  //
  //                   const question: any = {};
  //                   question.id = properties[2];
  //                   question.statement = properties[3];
  //                   question.options = [];
  //                   for (let i = 4; i < 8; i++) {
  //                     if (properties[i]) {
  //                       question.options.push(properties[i]);
  //                     }
  //                   }
  //                   question.answer = properties[8];
  //                   currentQuiz.push(question);
  //
  //                   rows.splice(j, 1);
  //                   j--;
  //                 }
  //
  //               } else {
  //                 console.log('in else');
  //                 rows.splice(j, 1);
  //                 j--;
  //               }
  //
  //             }
  //
  //             // ======================== check if a question of the quiz is deleted ========================
  //             const localQuestionIds = currentQuiz.map(ques => ques.qid);
  //             for (const question of quiz.questions) {
  //               console.log(question);
  //               if (localQuestionIds.includes(question.qid.toString())) {
  //                 // the question was not deleted
  //               } else {
  //                 // the question was deleted
  //                 // TODO: batch.delete(this.afStore.doc('quizzes/' + quiz.quiz_id.toString() + ).ref);
  //
  //               }
  //             }
  //
  //             console.log(quiz);
  //             console.log(currentQuiz);
  //             console.log(rows.length);
  //             break;
  //
  //           } else {
  //             console.log('quiz was deleted');
  //             // TODO: batch.delete(this.afStore.doc('quizzes/' + quiz.quiz_id.toString()).ref);
  //           }
  //
  //         }
  //         resolve();
  //
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }

  getTests(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('quizzes').valueChanges()
        .subscribe((next: any) => {
          // console.log('quizData', next);
          resolve(next);
        }, (queryError) => {
          reject(queryError);
        });
    });
  }

  getUsers(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('scores').valueChanges()
        .subscribe((next: any) => {
          // console.log('quizData', next);
          resolve(next);
        }, (queryError) => {
          reject(queryError);
        });
    });
  }

  getQuizData(quizId: string): Promise<any> {
    console.log('in getQuizData');
    return new Promise<any>((resolve, reject) => {
      this.afStore.doc('quizzes/' + quizId).valueChanges()
        .subscribe(async (next: any) => {
          // console.log('in getQuizData subscribe');
          if (next) {
            const questionIds = next.questions_ids;

            let questionsArray = [];
            try {
              for (let i = 0; i < questionIds.length; i += 10) {
                questionsArray = questionsArray.concat(
                  await this.afStore.collection('questions', ref => ref.where('qid', 'in', questionIds.slice(i, i + 10))).valueChanges()
                    .pipe(take(1)).toPromise());
              }
            } catch (questionsError) {
              reject(questionsError);
            }

            let answersArray = [];
            try {
              for (let i = 0; i < questionIds.length; i += 10) {
                answersArray = answersArray.concat(
                  await this.afStore.collection('answers', ref => ref.where('qid', 'in', questionIds.slice(i, i + 10))).valueChanges()
                    .pipe(take(1)).toPromise());
              }
            } catch (answersError) {
              reject(answersError);
            }

            questionsArray.sort((a, b) => (a.qid > b.qid) ? 1 : ((b.qid > a.qid) ? -1 : 0));
            answersArray.sort((a, b) => (a.qid > b.qid) ? 1 : ((b.qid > a.qid) ? -1 : 0));

            const arrayToReturn: any = [];
            questionsArray.forEach((question, i) => {
              question.answer = answersArray[i].answer;
              arrayToReturn.push(question);
            });
            arrayToReturn.quiz_id = next.quiz_id;
            arrayToReturn.quiz_name = next.quiz_name;
            arrayToReturn.tries = next.tries;
            resolve(arrayToReturn);

          } else {
            console.log('in getQuizData else');
            console.log(next);
          }
        }, (queryError) => {
          reject(queryError);
        });
    });
  }

  uploadQuiz(quiz: any): Promise<any> {
    console.log('in uploadQuiz', quiz);
    return new Promise<any>((resolve, reject) => {
      const batch = this.afStore.firestore.batch();
      const questionIDs = [];
      let originalQuiz: any = [];
      quiz.forEach(q => originalQuiz.push(Object.assign({}, q)));
      originalQuiz = originalQuiz.map(q => {
        delete q.answer;
        return q;
      });

      for (let i = 0; i < quiz.length; i++) {
        const uniqueQuestionId = quiz[i].qid ? quiz[i].qid : Math.random().toString(36).substring(7);
        questionIDs.push(uniqueQuestionId);
        originalQuiz[i].qid = uniqueQuestionId;
        batch.set(this.afStore.doc('questions/' + uniqueQuestionId).ref, originalQuiz[i]);
        batch.set(this.afStore.doc('answers/' + uniqueQuestionId).ref, {answer: quiz[i].answer, qid: uniqueQuestionId});
      }

      batch.commit()
        .then(() => {
          console.log('Original Quiz Id and Name');
          console.log(quiz);
          console.log(quiz.quiz_id);
          console.log(quiz.quiz_name);
          // const uniqueQuizId = quiz.quiz_id ? quiz.quiz_id : Date.now();
          // const uniqueQuizName = quiz.quiz_name ? quiz.quiz_name : Math.random().toString(36).substring(7);
          const uniqueQuizId = quiz.quiz_id || Date.now();
          const uniqueQuizName = quiz.quiz_name || Math.random().toString(36).substring(7);
          console.log('unique Quiz Id and Name');
          console.log(uniqueQuizId);
          console.log(uniqueQuizName);
          this.afStore.doc('quizzes/' + uniqueQuizId)
            .set({
              questions_ids: questionIDs,
              quiz_id: uniqueQuizId,
              quiz_name: uniqueQuizName,
              tries: quiz.tries ? quiz.tries : 0
            })
            .then(() => {
              resolve('successful');
            }).catch((dbError) => {
            reject(dbError);
          });
        })
        .catch(error => {
          reject(error);
        });

    });
  }

  deleteQuiz(quiz: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const batch = this.afStore.firestore.batch();
      // const questionIDs = [];
      // let originalQuiz = [];
      // quiz.forEach(q => originalQuiz.push(Object.assign({}, q)));
      // originalQuiz = originalQuiz.map(q => {
      //   delete q.answer;
      //   return q;
      // });
      // console.log('in deleteQuiz');
      // console.log(quiz);
      for (const mcq of quiz) {
        batch.delete(this.afStore.doc('questions/' + mcq.qid).ref);
        batch.delete(this.afStore.doc('answers/' + mcq.qid).ref);
      }

      batch.commit()
        .then(() => {
          this.afStore.doc('quizzes/' + quiz.quiz_id)
            .delete()
            .then(() => {
              resolve('successful');
            })
            .catch((dbError) => {
              reject(dbError);
            });
        })
        .catch(error => {
          reject(error);
        });

    });
  }

}
