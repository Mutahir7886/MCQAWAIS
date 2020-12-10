import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CreateQuizComponent} from './create-quiz/create-quiz.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSelectModule} from '@angular/material/select';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {UserHistoryComponent} from './user-history/user-history.component';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { ChartsModule } from 'ng2-charts';
import {AdminComponent} from './admin.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import {_MatMenuDirectivesModule, MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    CreateQuizComponent,
    UserHistoryComponent,
    QuizzesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbNavModule,
    MatSelectModule,
    ScrollingModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    AppBreadcrumbModule,
    AppAsideModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    _MatMenuDirectivesModule,
    MatMenuModule,
    MatExpansionModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatIconModule,
    MatTooltipModule,
    MatInputModule
  ]
})
export class AdminModule {
}
