import {Component, OnInit} from '@angular/core';
import {AdminQuizService} from '../../../shared/services/admin-quiz.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';


@Component({
  selector: 'app-admin-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoadingData = true;
  totalQuizzes = 0;
  totalMembers = 0;
  totalTries = 0;
  totalQuestions = 0;

  constructor(private adminQuizService: AdminQuizService,
              private ngxUiLoaderService: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.adminQuizService.getTests().then((allTests => {
      console.log('in Dashboard Comp');
      console.log(allTests);
      this.totalQuizzes = allTests.length;
      allTests.forEach(test => {
        this.totalTries += test.tries;
        // console.log(test);
        // console.log(test.questions_ids);
        this.totalQuestions += test.questions_ids.length;
      });
      this.adminQuizService.getUsers().then((users => {
        console.log(users);
        this.totalMembers = users.length;
        this.isLoadingData = false;
        this.ngxUiLoaderService.stop();
      }), (error) => {
        this.isLoadingData = false;
        console.log(error);
      });

    }), (error) => {
      this.isLoadingData = false;
      console.log(error);
    });
  }

  // exportDB(): void {
  //   this.adminQuizService.getDBasJSON().then((quizzes) => {
  //     console.log('DB as JSON', quizzes);
  //     // localStorage.setItem('db', JSON.stringify(result));
  //
  //     let str = '';
  //     let row = '';
  //
  //     const headerList = ['quiz_id', 'quiz_name', 'qid', 'statement', 'option1', 'option2', 'option3', 'option4', 'answer'];
  //     for (const header of Object.keys(headerList)) {
  //       row += headerList[header] + ',';
  //     }
  //     row = row.slice(0, -1);
  //     str += row + '\r\n';
  //
  //     for (const quiz of quizzes) {
  //       for (let j = 0; j < quiz.questions.length; j++) {
  //         row = '';
  //         console.log('quiz', quiz);
  //
  //         // if (j === 0) {
  //         //   row += '"' + quiz.quiz_id + '"' + ',';
  //         //   row += quiz.quiz_name + ',';
  //         //   // row += quiz.tries + ',';
  //         // } else {
  //         //   row += ',';
  //         //   row += ',';
  //         //   // row += ',';
  //         // }
  //
  //         row += quiz.quiz_id + ',';
  //         row += quiz.quiz_name + ',';
  //         row += quiz.questions[j].qid + ',';
  //         row += '`' + quiz.questions[j].statement + '`' + ',';
  //
  //         for (let i = 0; i < quiz.questions[j].options.length; i++) {
  //           row += quiz.questions[j].options[i] + ',';
  //         }
  //         for (let i = quiz.questions[j].options.length; i < 4; i++) {
  //           row += ',';
  //         }
  //         row += quiz.answers[j].answer + ',';
  //         row.slice(0, -1);
  //         str += row + '\r\n';
  //       }
  //     }
  //
  //     // console.log('exporting');
  //     // // console.log(str.split('\r\n'));
  //     // for (const temp of str.split('\r\n')){
  //     //   console.log(temp);
  //     // }
  //
  //     const uri = 'data:text/csv;charset=utf-8,' + str;
  //     const downloadLink = document.createElement('a');
  //     downloadLink.href = uri;
  //     downloadLink.download = 'export.csv';
  //
  //     document.body.appendChild(downloadLink);
  //     downloadLink.click();
  //     document.body.removeChild(downloadLink);
  //
  //   });
  // }

  // insertDB(fileInput: HTMLInputElement): void {
  //
  //   if (fileInput.files && fileInput.files[0]) {
  //     const reader = new FileReader();
  //     reader.readAsText(fileInput.files[0]);
  //     reader.onload = (e) => {
  //       // console.log('CSV:', reader.result);
  //       // const rows = reader.result.toString().split('\r\n');
  //       // console.log('CSV:', rows[0].split(','));
  //       // console.log('CSV:', rows[1].split(','));
  //       // console.log('CSV:', rows[2].split(','));
  //
  //       this.adminQuizService.insertDB(reader.result.toString())
  //         .then((result) => {
  //           // do nothing
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     };
  //   }
  //
  //
  // }

  // updateDB(uploadFile: HTMLInputElement): void {
  //   if (uploadFile.files && uploadFile.files[0]) {
  //     const reader = new FileReader();
  //     reader.readAsText(uploadFile.files[0]);
  //     reader.onload = (e) => {
  //       console.log('in updateDB');
  //       console.log('CSV: ', reader.result);
  //
  //
  //       this.adminQuizService.updateDB(reader.result)
  //         .then((result) => {
  //           // do nothing
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     };
  //   }
  //
  //
  // }
}
