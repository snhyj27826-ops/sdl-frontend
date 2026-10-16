import { Routes } from '@angular/router';

import { HomeComponent } from '@src/app/website/home/home.component';
import { AuthComponent } from '@src/app/dashboard/auth/auth.component';
import { NotFoundComponent } from '@src/app/shared/components/not-found/not-found.component';
import { DashboardComponent } from '@src/app/dashboard/board/dashboard.component';
import { AuthGuard } from '@src/app/auth.guard';
import { ApplicationFormComponent } from '@src/app/website/application/application-form/application-form.component';
import { AboutComponent } from '@src/app/website/about/about.component';
import { OrganizationComponent } from '@src/app/website/about/organization/organization.component';
import { NewsComponent } from '@src/app/website/news/news.component';
import { NewsDetailComponent } from '@src/app/website/news/news-detail/news-detail.component';
import { ContactComponent } from '@src/app/website/contact/contact.component';
import { WebsiteLayoutComponent } from '@src/app/website/website-layout.component';
import { DashboardLayoutComponent } from '@src/app/dashboard/dashboard-layout.component';
import { AgendaComponent } from '@src/app/website/agenda/agenda.component';
import { HistoryComponent } from '@src/app/website/history/history.component';
import { SdlComponent } from '@src/app/website/about/sdl/sdl.component';
import { VideosComponent } from '@src/app/website/videos/videos.component';
import { UnderConstructionComponent } from '@src/app/shared/components/under-construction/under-construction.component';
import { env } from '@src/environment';

const applicationRoutes: Routes = [
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'PAGE_TITLE_HOME',
      },
      {
        path: 'apply',
        component: ApplicationFormComponent,
        title: 'PAGE_TITLE_APPLICATION',
      },
      {
        path: 'about',
        component: AboutComponent,
        title: 'PAGE_TITLE_ABOUT',
      },
      {
        path: 'about/organization',
        component: OrganizationComponent,
        title: 'PAGE_TITLE_ORGANIZATION',
      },
      {
        path: 'about/sdl',
        component: SdlComponent,
        title: 'PAGE_TITLE_ABOUT_SDL',
      },
      {
        path: 'agenda',
        component: AgendaComponent,
        title: 'PAGE_TITLE_AGENDA',
      },
      {
        path: 'news',
        component: NewsComponent,
        title: 'PAGE_TITLE_NEWS',
      },
      {
        path: 'news/:slug',
        component: NewsDetailComponent,
        title: 'PAGE_TITLE_NEWS',
      },
      {
        path: 'videos',
        component: VideosComponent,
        title: 'PAGE_TITLE_VIDEOS',
      },
      {
        path: 'history',
        component: HistoryComponent,
        title: 'PAGE_TITLE_HISTORY',
      },
      {
        path: 'contact',
        component: ContactComponent,
        title: 'PAGE_TITLE_CONTACT',
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'login',
        component: AuthComponent,
        title: 'PAGE_TITLE_SIGN_IN',
      },
      {
        path: 'register',
        component: AuthComponent,
        title: 'PAGE_TITLE_REGISTER',
      },
      {
        path: 'board',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        title: 'PAGE_TITLE_DASHBOARD',
      },
      {
        path: 'verify-account/:token',
        component: AuthComponent,
        title: 'PAGE_TITLE_VERIFY_ACCOUNT',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'PAGE_TITLE_NOT_FOUND',
  },
];

export const routes: Routes = env.constructionMode
  ? [{ path: '**', component: UnderConstructionComponent, title: 'PAGE_TITLE_CONSTRUCTION' }]
  : applicationRoutes;
