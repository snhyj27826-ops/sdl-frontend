import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@src/app/home/home.component';
import { AuthComponent } from './dashboard/auth/auth.component';
import { NotFoundComponent } from '@src/app/shared/components/not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { ApplicationFormComponent } from './application/application-form/application-form.component';
import {AboutComponent} from "@src/app/about/about.component";
import {NewsComponent} from "@src/app/news/news.component";
import {ContactComponent} from "@src/app/contact/contact.component";

const routes: Routes = [
  {
    path: 'apply',
    component: ApplicationFormComponent
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'register',
    component: AuthComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "verify-account/:token",
    component: AuthComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: "news",
    component: NewsComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
