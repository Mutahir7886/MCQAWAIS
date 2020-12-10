import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CreateQuizComponent} from './create-quiz/create-quiz.component';
import {UserHistoryComponent} from './user-history/user-history.component';
import {AdminComponent} from './admin.component';
import {QuizzesComponent} from './quizzes/quizzes.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'create-quiz',
        component: CreateQuizComponent
      },
      {
        path: 'quizzes',
        component: QuizzesComponent
      },
      {
        path: 'history',
        component: UserHistoryComponent
      }
    ]
  }
];

// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'user-history',
//     pathMatch: 'full'
//   },
//   {
//     path: 'create-quiz',
//     component: CreateQuizComponent
//   },
//   {
//     path: 'user-history',
//     component: UserHistoryComponent
//   }
// ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
