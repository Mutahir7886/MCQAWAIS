import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthModule} from './modules/auth/auth.module';
import {AuthGuard} from './shared/guards/auth.guard';
import {AdminGuard} from './shared/guards/admin.guard';

// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () => AuthModule,
//     canActivate: [AuthGuard]
//   },
//   {
//     path: 'auth',
//     loadChildren: () => AuthModule,
//     canActivate: [AuthGuard]
//   },
//   {
//     path: 'admin',
//     loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
//     canActivate: [AdminGuard]
//   }
// ];
//
const routes: Routes = [
  {
    path: '',
    loadChildren: () => AuthModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => AuthModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
