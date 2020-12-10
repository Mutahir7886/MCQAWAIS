import { Component, OnInit } from '@angular/core';
import {AdminQuizService} from '../../../shared/services/admin-quiz.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent implements OnInit {

  allQuizzes: any = [];
  active = 'all-quizzes';
  currentQuizData = null;
  currentQuizId = null;

  isLoadingAllQuizzes = false;
  isLoadingQuiz = false;
  // isShowingQuizDetails = false;
  // showCreateQuiz= false;

  constructor(private quizService: AdminQuizService,
              private modalService: NgbModal,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    console.log('in ngOnInit');

    this.isLoadingAllQuizzes = true;
    this.ngxService.start()
    this.quizService.getTests()
      .then((quizzes) => {
        console.log('lkajsldkfjasd', quizzes);
        for (const quiz of quizzes) {
          this.allQuizzes.push(quiz);
        }
        if (this.allQuizzes.length > 0) {
          this.currentQuizId = this.allQuizzes[0].quiz_id;
          // this.active = this.allQuizzes[0].quiz_name.toString();


          this.quizService.getQuizData(this.currentQuizId)
            .then((result) => {
              console.log('returned Quiz', result);
              this.currentQuizData = result;
              this.isLoadingAllQuizzes = false;
              this.ngxService.stop()

            })
            .catch((quizError) => {
              console.log(quizError);
              this.isLoadingAllQuizzes = false;
              this.ngxService.stop()
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  loadQuiz(quiz: any): void {
    console.log('in loadQuiz');
    this.isLoadingQuiz = true;
    this.currentQuizId = quiz.quiz_id;
    // this.isShowingQuizDetails = false;

    this.quizService.getQuizData(this.currentQuizId)
      .then((result) => {
        console.log('returned Quiz', result);
        this.currentQuizData = result;
        this.isLoadingQuiz = false;
        this.active = 'show-details';
        // this.isShowingQuizDetails = true;
      })
      .catch((quizError) => {
        console.log(quizError);
        this.isLoadingQuiz = false;
      });
  }

  quizDeleted($event: any): void {
    this.allQuizzes = this.allQuizzes.filter(quiz => {
      return quiz.quiz_id !== $event;
    });
    if (this.allQuizzes.length > 0) {
      // this.active = this.allQuizzes[0].quiz_name;
      this.loadQuiz(this.allQuizzes[0]);
    }
  }

  quizNameUpdated(quiz: any): void {
    const index = this.allQuizzes.findIndex(q => q.quiz_id === quiz.quiz_id);
    this.allQuizzes[index].quiz_name = quiz.quiz_name;
    // this.active = this.allQuizzes[index].quiz_name;
  }

  // openLeaveQuizPageModal(addMCQModal: any) {
  //   this.modalService.open(addMCQModal, {ariaLabelledBy: 'modal-basic-title'}).result
  //     .then((result) => {
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  //
  // leavepage() {
  //   this.showCreateQuiz = false;
  //   this.modalService.dismissAll();
  // }

  importQuizzes(fileInput: HTMLInputElement): void {

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.readAsText(fileInput.files[0]);
      reader.onload = (e) => {
        // console.log('CSV:', reader.result);
        // const rows = reader.result.toString().split('\r\n');
        // console.log('CSV:', rows[0].split(','));
        // console.log('CSV:', rows[1].split(','));
        // console.log('CSV:', rows[2].split(','));

        this.quizService.insertDB(reader.result.toString())
          .then((result) => {
            // do nothing
          })
          .catch((error) => {
            console.log(error);
          });
      };
    }
  }

  exportDB(): void {
    this.quizService.getDBasJSON().then((quizzes) => {
      console.log('DB as JSON', quizzes);
      // localStorage.setItem('db', JSON.stringify(result));

      let str = '';
      let row = '';

      const headerList = ['quiz_id', 'quiz_name', 'qid', 'statement', 'option1', 'option2', 'option3', 'option4', 'answer'];
      for (const header of Object.keys(headerList)) {
        row += headerList[header] + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';

      for (const quiz of quizzes) {
        for (let j = 0; j < quiz.questions.length; j++) {
          row = '';
          console.log('quiz', quiz);

          // if (j === 0) {
          //   row += '"' + quiz.quiz_id + '"' + ',';
          //   row += quiz.quiz_name + ',';
          //   // row += quiz.tries + ',';
          // } else {
          //   row += ',';
          //   row += ',';
          //   // row += ',';
          // }

          row += quiz.quiz_id + ',';
          row += quiz.quiz_name + ',';
          row += quiz.questions[j].qid + ',';
          row += '`' + quiz.questions[j].statement + '`' + ',';

          for (let i = 0; i < quiz.questions[j].options.length; i++) {
            row += quiz.questions[j].options[i] + ',';
          }
          for (let i = quiz.questions[j].options.length; i < 4; i++) {
            row += ',';
          }
          row += quiz.answers[j].answer + ',';
          row.slice(0, -1);
          str += row + '\r\n';
        }
      }

      // console.log('exporting');
      // // console.log(str.split('\r\n'));
      // for (const temp of str.split('\r\n')){
      //   console.log(temp);
      // }

      const uri = 'data:text/csv;charset=utf-8,' + str;
      const downloadLink = document.createElement('a');
      downloadLink.href = uri;
      downloadLink.download = 'export.csv';

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

    });
  }


}
