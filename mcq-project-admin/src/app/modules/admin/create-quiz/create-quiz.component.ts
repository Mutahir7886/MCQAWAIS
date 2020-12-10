import {Component, Input, OnInit, Output, TemplateRef, ViewEncapsulation, EventEmitter} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AdminQuizService} from '../../../shared/services/admin-quiz.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-quiz-component',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateQuizComponent implements OnInit {

  mcqForm: FormGroup;
  isUploadingQuiz = false;
  isDeletingQuiz = false;

  toShowUploadButton = false;

  @Input() isEditingTestName = true;
  @Input() quiz: any = [];
  @Input() toShowDeleteButton = false;
  @Input() currentComponent = 'quiz';

  @Output() quizDeleted = new EventEmitter();
  @Output() quizNameUpdated = new EventEmitter();
  @Output() goBackClicked = new EventEmitter();


  answerIndex = -1;

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private quizService: AdminQuizService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {

    this.mcqForm = this.formBuilder.group({
      statement: ['', Validators.required],
      options: this.formBuilder.array([]),
      answer: ['', Validators.required]
    });
    if (localStorage.getItem('quiz')) {
      this.quiz = JSON.parse(localStorage.getItem('quiz'));
      this.quiz.quiz_name = JSON.parse(localStorage.getItem('quiz_name'));
      this.isEditingTestName = false;
      this.toShowUploadButton= true;
      this.toShowDeleteButton=true;
    }
  }

  get statement(): FormControl {
    return this.mcqForm.get('statement') as FormControl;
  }

  get answer(): FormControl {
    return this.mcqForm.get('answer') as FormControl;
  }

  get options(): FormArray {
    return this.mcqForm.get('options') as FormArray;
  }

  openAddMCQModal(addMCQModal: TemplateRef<any>): void {
    this.answerIndex = 0;
    this.modalService.open(addMCQModal, {ariaLabelledBy: 'modal-basic-title'}).result
      .then((result) => {
        console.log('formValue in openAddMCQModal', this.mcqForm.value);
        // this.quiz.addMCQ(this.mcqForm.value);
        this.quiz.push(this.mcqForm.value);
        console.log('abc',this.quiz)
        while (this.options.length !== 0) {
          this.options.removeAt(0);
        }
        this.toShowUploadButton = true;
        this.toShowDeleteButton = true;
        localStorage.setItem('quiz', JSON.stringify(this.quiz));
        localStorage.setItem('quiz_name', JSON.stringify(this.quiz.quiz_name));
        this.quizService.unsavedQuiz.next(true)

        console.log(this.quiz);
        this.mcqForm.reset();
        // console.log(this.quiz);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // openUpdateMCQModal(updateMCQModal: TemplateRef<any>, mcq: any): void {
  //   console.log(mcq);
  //   // this.showOptions(mcq.options.length);
  //   this.answer.setValue(mcq.answer);
  //   this.statement.setValue(mcq.statement);
  //   mcq.options.forEach((option, i) => {
  //     this.options.controls[i].setValue(option);
  //   });
  //   this.modalService.open(updateMCQModal, {ariaLabelledBy: 'update-modal-basic-title'}).result
  //     .then((result) => {
  //       console.log('formValue in updateMCQModal', this.mcqForm.value);
  //       const currentMCQIndex = this.quiz.findIndex(q => q.qid === mcq.qid);
  //       this.quiz[currentMCQIndex] = this.mcqForm.value;
  //       this.quiz[currentMCQIndex].qid = mcq.qid;
  //       // this.quiz.push(this.mcqForm.value);
  //       while (this.options.length !== 0) {
  //         this.options.removeAt(0);
  //       }
  //       this.mcqForm.reset();
  //       this.toShowUploadButton = true;
  //       this.toShowDeleteButton = true;
  //       // console.log(this.quiz);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  openUpdateMCQModal(addMCQModal: TemplateRef<any>, mcq: any): void {
    console.log(mcq);
    // this.showOptions(mcq.options.length);
    this.answer.setValue(mcq.answer);
    this.statement.setValue(mcq.statement);
    while (this.options.length !== 0) {
      this.options.removeAt(0);
    }
    mcq.options.forEach((option, i) => {
      // console.log('option is', option);
      if (option === this.answer.value) {
        this.answerIndex = i;
      }
      this.addOption();
      this.options.controls[i].setValue(option);
    });
    console.log(this.mcqForm.value);
    this.modalService.open(addMCQModal, {ariaLabelledBy: 'modal-basic-title'}).result
      .then((result) => {
        console.log('formValue in updateMCQModal', this.mcqForm.value);
        const currentMCQIndex = this.quiz.findIndex(q => q.qid === mcq.qid);
        this.quiz[currentMCQIndex] = this.mcqForm.value;
        this.quiz[currentMCQIndex].qid = mcq.qid;
        // this.quiz.push(this.mcqForm.value);
        while (this.options.length !== 0) {
          this.options.removeAt(0);
        }
        this.mcqForm.reset();
        this.toShowUploadButton = true;
        this.toShowDeleteButton = true;
        // console.log(this.quiz);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteMCQ(mcq: any): void {
    // console.log(this.quiz);
    // console.log(mcq);
    const quizName = this.quiz.quiz_name;
    const quizId = this.quiz.quiz_id;

    if (this.currentComponent === 'quiz') {
      this.quiz = this.quiz.filter(q => {
        return q.statement !== mcq.statement;
      });
    } else {
      this.quiz = this.quiz.filter(q => {
        return q.qid !== mcq.qid;
      });
    }

    this.quiz.quiz_name = quizName;
    this.quiz.quiz_id = quizId;
    // console.log(this.quiz);
    this.toShowUploadButton = true;

  }

  uploadQuiz(): void {
    console.log('in uploadQuiz', this.quiz);
    if (this.quiz.quiz_name) {
      this.isUploadingQuiz = true;
      this.quizService.uploadQuiz(this.quiz)
        .then((result) => {
          // console.log(result);
          this.quiz = this.quiz.quiz_id ? this.quiz : [];
          localStorage.removeItem('quiz')
          localStorage.removeItem('quiz_name')
          this.quizService.unsavedQuiz.next(false)
          // this.quiz = [];
          console.log('in uploadQuiz success', this.quiz);
          this.quizNameUpdated.emit(this.quiz);
          this.isUploadingQuiz = false;
          this.toastr.success('Your quiz has been successfully uploaded');
          this.toShowUploadButton = false;
          if (this.currentComponent === 'quiz') {
            this.toShowDeleteButton = false;
            this.isEditingTestName = true;
          } else {
            this.toShowDeleteButton = true;
            this.isEditingTestName = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.toastr.error(error);
          this.isUploadingQuiz = false;
        });
    } else {
      this.toastr.info('Test name required.');
    }
  }

  addOption(): void {
    this.options.push(new FormControl('', Validators.required));
  }

  removeOption(optionIndex: number): void {
    console.log('in removeOption');
    if (this.answer.value === this.options.controls[optionIndex].value || this.options.length === 2) {
      // this means that the option that is going to be deleted was marked as answer
      // OR
      // there were two options and one of them was marked as answer, but after delete there
      // will only be one answer remaining, which will be marked as answer but we don't want
      // to submit an mcq with only one option
      this.answer.setValue('');
    }
    // console.log(option.value);
    // console.log(this.mcqForm.value);
    // console.log(this.options.value);
    // console.log(this.options.controls.values());
    // this.options.controls = this.options.controls.filter(op => {
    //   console.log('op.value', op.value);
    //   console.log('option.value', option.value);
    //   if (op.value !== option.value) {
    //     console.log('not equal');
    //   }
    //   return op.value !== option.value;
    // });
    // console.log(this.mcqForm.value);
    // console.log(this.options.value);
    // console.log(this.options.controls.values());
    // console.log(this.options.controls);
    // console.log(this.options.value);
    // this.options.controls.splice(optionIndex, 1);
    // console.log(this.options.controls);
    console.log(this.options.value);
    this.options.removeAt(optionIndex);
    this.mcqForm.markAsDirty();
    console.log(this.options.value);
  }


  deleteQuiz(): void {
    console.log('bbb',this.quiz)

    this.isDeletingQuiz = true;
    if (this.quiz.quiz_id) {
      this.quizService.deleteQuiz(this.quiz)
        .then((result) => {
          console.log('aaa',result)
          localStorage.removeItem('quiz')
          localStorage.removeItem('quiz_name')
          this.quizService.unsavedQuiz.next(false)
          this.quizDeleted.emit(this.quiz.quiz_id);
          this.quiz = [];
          this.isDeletingQuiz = false;
          this.toastr.success('Your quiz has been successfully deleted');
          this.toShowUploadButton = false;
          this.toShowDeleteButton = false;
        })
        .catch((error) => {
          console.log(error);
          this.toastr.error(error);
          this.isDeletingQuiz = false;
        });
    } else {
      localStorage.removeItem('quiz')
      localStorage.removeItem('quiz_name')
      this.quizService.unsavedQuiz.next(false)
      this.isEditingTestName = true;


      this.quiz = [];
      this.isDeletingQuiz = false;
      this.toastr.success('Your quiz has been successfully deleted');
      this.toShowUploadButton = false;
      this.toShowDeleteButton = false;
    }
  }

  quiz_name = '';

  saveName() {
    this.quiz_name = this.quiz.quizName;
  }
}
