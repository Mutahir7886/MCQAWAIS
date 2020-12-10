import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserHistoryService {
  constructor(private afStore: AngularFirestore) {
  }

  getInitialData(): Promise<any> {
    console.log('in getInitialData');
    return new Promise((resolve, reject) => {
      this.afStore.collection('scores').snapshotChanges()
        .pipe(take(1)).subscribe((data: any) => {
        // console.log(data);
        const userIds = data.map(d => {
          return {
            userId: d.payload.doc.id
          };
        });
        // console.log(userIds);
        for (let i = 0; i < data.length; i++) {
          userIds[i].quizzes = data[i].payload.doc.data().quizzes;
          userIds[i].user_name = data[i].payload.doc.data().user_name;
        }
        resolve(userIds);
      }, error => {
        reject(error);
      });
    });
  }

  getQuizzes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afStore.collection('quizzes').valueChanges()
        .pipe(take(1)).subscribe((quizzes: any) => {
        // console.log('in getQuizzes', quizzes);
        resolve(quizzes);
      }, error => {
        reject(error);
      });
    });
  }


  // getAttempts(userIds: any[], quizIds: any[]): Promise<any> {
  //   console.log('in getAttempts');
  //   return new Promise((resolve, reject) => {
  //     const quizzesToReturn = [];
  //
  //
  //
  //     // this.afStore.collection('scores/' + userId + '/' + quizId).valueChanges()
  //     //   .pipe(take(1)).subscribe((quizData: any) => {
  //     //   // console.log('in inner', userData);
  //     //   resolve(quizData);
  //     // }, innerError => {
  //     //   reject(innerError);
  //     // });
  //
  //
  //
  //     // this.afStore.firestore.runTransaction((transaction) => {
  //     //   console.log('in runTransaction');
  //     // for (const [i, qid] of quizIds.entries()) {
  //     //   console.log('[i, qid]', i, qid);
  //     //   quizzesToReturn.push({
  //     //     quiz_id: qid,
  //     //     users: []
  //     //   });
  //     //   for (const [j, uid] of userIds.entries()) {
  //     //     let docRef = this.afStore.doc('scores/' + uid + '/' + qid).ref;
  //     //     return transaction.get(docRef).then((returnedDoc) => {
  //     //       if (!returnedDoc) {
  //     //         quizzesToReturn[i].users.push({
  //     //           user_id: uid,
  //     //           attempts: []
  //     //         });
  //     //       } else {
  //     //         quizzesToReturn[i].users.push({
  //     //           user_id: uid,
  //     //           attempts: returnedDoc
  //     //         });
  //     //       }
  //     //     });
  //     //   }
  //     // }
  //     // })
  //     //   .then((result) => {
  //     //     console.log('after running transaction', result);
  //     //     console.log('after running transaction', quizzesToReturn);
  //     //     resolve(result);
  //     //   })
  //     //   .catch((error) => {
  //     //     reject(error);
  //     //   });
  //   });
  // }

  getAttempts(users: any[], quizzes: any[]): Promise<any> {
    console.log('users', users);
    console.log('quizIds', quizzes);
    // return this.getSingleUserAttempts(userIds[0], quizzesArray);
    return new Promise<any>((resolve, reject) => {
      try {
        let arrayToReturn = [];
        users.forEach(async (user, i) => {
          const tempArray = await this.getSingleUserAttempts(user, quizzes);
          console.log('tempArray', tempArray);
          arrayToReturn = arrayToReturn.concat(tempArray);
          if (i === users.length - 1) {
            console.log('arrayToReturn', arrayToReturn);
            resolve(arrayToReturn);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private getSingleUserAttempts(user: any, quizzes: any[]): Promise<any> {
    let quizArray = [];
    return new Promise((resolve, reject) => {
      this.afStore.doc('scores/' + user.user_id).valueChanges()
        .pipe(take(1)).subscribe(async (userQuizzes: any) => {
        try {
          for (const quiz of quizzes) {
            // console.log(userQuizzes.quizzes);
            // console.log(quizId);
            // const quizNameIndex = userQuizzes.quizzes.findIndex(q => q.quiz_id === quizId);

            const allAttempts = await this.afStore.collection('scores/' + user.user_id + '/' + quiz.quiz_id).valueChanges().pipe(take(1)).toPromise();
            // console.log('value returned', a)
            allAttempts.forEach((attempt: any, i) => {
              // attempt.quiz_name = currentQuizName;
              attempt.user_name = user.user_name;
              attempt.quiz_id = quiz.quiz_id;
              attempt.quiz_name = quiz.quiz_name;
              attempt.attemptNo = i + 1;
            });
            // quizArray = quizArray.concat(allAttempts.length === 0 ? [{isEmpty: true, quiz_name: currentQuizName}] : allAttempts);
            quizArray = quizArray.concat(allAttempts.length === 0 ? {
              isEmpty: true,
              quiz_id: quiz.quiz_id,
              quiz_name: quiz.quiz_name,
              user_name: user.user_name
            } : allAttempts);
          }
        } catch (e) {
          reject(e);
        }
        resolve(quizArray);
      }, innerError => {
        reject(innerError);
      });
    });
  }


}
