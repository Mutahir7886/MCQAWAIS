import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserHistoryService} from '../../../shared/services/user-history.service';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css'],
})

export class UserHistoryComponent implements OnInit {

  scoresData = null;
  quizzesArray = [];

  // leftActive: string;
  // topActive: string;
  //
  // leftArray = [];
  // topArray = [];

  quizzesDropDownList = [];
  quizzesSelected = [];
  quizzesDropDownSettings: IDropdownSettings = {};
  usersDropDownList = [];
  usersSelected = [];
  usersDropDownSettings: IDropdownSettings = {};

  // view: string;

  // currentQuiz = null;
  attemptsData = null;
  currentAttempt = null;

  isDataLoading = true;
  // isLoadingAttempts = true;

  constructor(private userHistoryService: UserHistoryService,
              private toastr: ToastrService,
              private modalService: NgbModal,
              private ngxUiLoaderService: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.isDataLoading = true;
    this.userHistoryService.getInitialData().then(value => {
      this.scoresData = value;
      console.log('in UserHistory ngOnInit');
      this.usersDropDownList = this.scoresData.map(userData => {
        return {
          item_id: userData.userId,
          item_text: userData.user_name
        };
      });
      // this.usersSelected = this.usersDropDownList.map(u => u.item_id);
      // this.usersSelected = this.usersDropDownList;
      // console.log(this.scoresData);
      // console.log(this.usersDropDownList);
      // console.log(this.usersSelected);
      this.userHistoryService.getQuizzes().then(innerValue => {
        this.quizzesArray = innerValue;

        this.quizzesDropDownList = this.quizzesArray.map(quizData => {
          return {
            item_id: quizData.quiz_id,
            item_text: quizData.quiz_name
          };
        });
        // this.quizzesSelected = this.quizzesDropDownList.map(q => q.item_id);
        // this.quizzesSelected = this.quizzesDropDownList;
        // console.log('this.quizzesArray', this.quizzesArray);
        // console.log('quizzesDropDownList', this.quizzesDropDownList);
        // this.isDataLoading = false;
        this.loadAttempts();

        // this.isLoadingAttempts = true;
        const users = this.usersDropDownList.map(u => {
          return {
            user_id: u.item_id,
            user_name: u.item_text
          };
        });
        const quizzes = this.quizzesDropDownList.map(q => {
          return {
            quiz_id: q.item_id,
            quiz_name: q.item_text
          };
        });

        // console.log('users', users);
        // console.log('quizzes', quizzes);
        this.userHistoryService.getAttempts(users, quizzes).then(attemptsValue => {
          this.attemptsData = attemptsValue;
          // console.log('attemptsValue', attemptsValue);
          // this.currentQuiz = value;
          // console.log(this.currentQuiz);
          // this.isLoadingTop = false;
          // this.isLoadingAttempts = false;
          this.isDataLoading = false;
          // this.isLoadingAttempts = false;

          this.ngxUiLoaderService.stop();
        }, attemptsError => {
          console.log(attemptsError);
          // this.isLoadingTop = false;
          this.isDataLoading = false;
          // this.isLoadingAttempts = false;
          this.ngxUiLoaderService.stop();

        });

        // this.viewChanged('quizzes');
        // console.log(value);
      }, innerError => {
        this.isDataLoading = false;
        console.log(innerError);
        this.ngxUiLoaderService.stop();

      });
    }, error => {
      this.isDataLoading = false;
      console.log(error);
      this.ngxUiLoaderService.stop();

    });

    this.usersDropDownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.quizzesDropDownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  //
  // onItemSelect(item: any) {
  //   console.log(item);
  // }
  //
  // onSelectAll(items: any) {
  //   console.log(items);
  // }

  showAttemptDetails(attemptDetailsModal: TemplateRef<any>, attempt: any): void {
    this.currentAttempt = attempt;
    this.modalService.open(attemptDetailsModal, {ariaLabelledBy: 'modal-basic-title'}).result
      .then((modalResult) => {
        // on close
      })
      .catch((modalError) => {
        console.log(modalError);
      });
  }

  // viewChanged(view: string): void {
  //   console.log('in viewChanged');
  //
  //   this.view = view;
  //   if (view === 'quizzes') {
  //     this.leftArray = this.quizzesArray.map(q => {
  //       return {
  //         name: q.quiz_name,
  //         id: q.quiz_id
  //       };
  //     });
  //
  //   } else {
  //
  //     this.leftArray = this.scoresData.map(item => {
  //       return {
  //         id: item.userId,
  //         name: item.user_name
  //       };
  //     });
  //   }
  //
  //   this.leftClicked(this.leftArray[0]);
  // }

  // leftClicked(leftItem: any): void {
  //   console.log('in leftClicked');
  //   console.log(leftItem);
  //   console.log(this.leftArray);
  //   this.leftActive = leftItem.name;
  //   if (this.view === 'quizzes') {
  //     this.topArray = [];
  //     this.scoresData.forEach(userData => {
  //       // console.log('userData.quizIds', userData.quizIds);
  //       // console.log('this.leftArray[0].quiz_id', this.leftArray[0].quiz_id);
  //       userData.quizzes.forEach(quizData => {
  //         if (quizData.quiz_id === leftItem.id) {
  //           this.topArray.push({
  //             id: userData.userId,
  //             name: userData.user_name
  //           });
  //         }
  //       });
  //     });
  //
  //     console.log(this.leftArray);
  //     console.log(this.topArray);
  //
  //     if (this.topArray.length > 0) {
  //       // console.log('in the in');
  //       this.loadAttempts(this.topArray[0].id, leftItem.id);
  //       this.topActive = this.topArray[0].name;
  //     } else {
  //       this.currentQuiz = [];
  //     }
  //   } else {
  //     const index = this.scoresData.findIndex(userData => userData.userId === leftItem.id);
  //     this.topArray = this.scoresData[index].quizzes.map(item => {
  //       return {
  //         id: item.quiz_id,
  //         name: item.quiz_name
  //       };
  //     });
  //
  //     // this.topArray = this.scoresData[index].quizIds;
  //
  //     console.log(this.leftArray);
  //     console.log(this.topArray);
  //
  //     if (this.topArray.length > 0) {
  //       this.loadAttempts(leftItem.id, this.topArray[0].id);
  //       this.topActive = this.topArray[0].name;
  //     } else {
  //       this.currentQuiz = [];
  //     }
  //
  //   }
  // }

  // topClicked(leftItem: any, topItem: any): void {
  //   console.log('in topClicked');
  //   console.log(topItem);
  //   if (this.view === 'quizzes') {
  //     this.topActive = topItem.name;
  //     this.loadAttempts(topItem.id, leftItem.id);
  //   } else {
  //     this.topActive = topItem.name;
  //     this.loadAttempts(leftItem.id, topItem.id);
  //   }
  // }

  loadAttempts(): void {
    console.log('in loadAttempts');
    // this.isDataLoading = true;
    // this.isLoadingAttempts = true;
    this.ngxUiLoaderService.start();
    let users = this.usersSelected.map(u => {
      return {
        user_id: u.item_id,
        user_name: u.item_text
      };
    });
    let quizzes = this.quizzesSelected.map(q => {
      return {
        quiz_id: q.item_id,
        quiz_name: q.item_text
      };
    });

    if (users.length <= 0) {
      users = this.scoresData.map(userData => {
        return {
          user_id: userData.userId,
          user_name: userData.user_name
        };
      });
    }

    if (quizzes.length <= 0) {
      quizzes = this.quizzesArray.map(quizData => {
        return {
          quiz_id: quizData.quiz_id,
          quiz_name: quizData.quiz_name
        };
      });
    }
    // console.log(users);
    // console.log(quizzes);
    this.userHistoryService.getAttempts(users, quizzes).then(value => {
      this.attemptsData = value;
      console.log('attemptsData', this.attemptsData);
      // this.currentQuiz = value;
      // console.log(this.currentQuiz);
      // this.isLoadingTop = false;
      // this.isLoadingAttempts = false;
      // this.isDataLoading = false;
      // this.isLoadingAttempts = false;
      this.ngxUiLoaderService.stop();
    }, attemptsError => {
      console.log(attemptsError);
      // this.isLoadingTop = false;
      // this.isDataLoading = false;
      // this.isLoadingAttempts = false;
      this.ngxUiLoaderService.stop();
    });
  }

  // quizSelected($event: any): void {
  //   console.log('in quizSelected', $event);
  //   console.log('in quizSelected', this.quizzesArray);
  // }
  //
  // userSelected($event: any): void {
  //   console.log('in quizSelected', $event);
  //   console.log('in quizSelected', this.quizzesArray);
  // }
}
