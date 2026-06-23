import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@src/app/website/home/home.component';
import { AuthComponent } from './dashboard/auth/auth.component';
import { NotFoundComponent } from '@src/app/shared/components/not-found/not-found.component';
import { DashboardComponent } from '@src/app/dashboard/board/dashboard.component';
import { AuthGuard } from './auth.guard';
import { ApplicationFormComponent } from '@src/app/website/application/application-form/application-form.component';
import {AboutComponent} from "@src/app/website/about/about.component";
import {NewsComponent} from "@src/app/website/news/news.component";
import {ContactComponent} from "@src/app/website/contact/contact.component";
import {WebsiteLayoutComponent} from "@src/app/website/website-layout.component";
import {DashboardLayoutComponent} from "@src/app/dashboard/dashboard-layout.component";

const routes: Routes = [
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      {
        path: 'apply',
        component: ApplicationFormComponent
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
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'login',
        component: AuthComponent
      },
      {
        path: 'register',
        component: AuthComponent,
      },
      {
        path: 'board',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "verify-account/:token",
        component: AuthComponent
      }
    ]
  },
  // 404 not found
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
