import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatMenuModule} from '@angular/material/menu';
import {ToastrModule} from 'ngx-toastr';

import {AuthModule} from './modules/auth/auth.module';
import {AdminModule} from './modules/admin/admin.module';

import {AuthService} from './shared/services/auth.service';
import {AuthGuard} from './shared/guards/auth.guard';
import {AdminGuard} from './shared/guards/admin.guard';

import {AdminQuizService} from './shared/services/admin-quiz.service';
import {UserHistoryService} from './shared/services/user-history.service';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ChartsModule} from 'ng2-charts';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgxUiLoaderModule} from 'ngx-ui-loader';

// import {DefaultLayoutComponent} from './containers/default-layout';
//
// const APP_CONTAINERS = [
//   DefaultLayoutComponent
// ];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatMenuModule,
    ToastrModule.forRoot(),
    AuthModule,
    AdminModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    NgxUiLoaderModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    AdminQuizService,
    UserHistoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
