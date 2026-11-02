import { HeaderMenuItem } from '@src/app/shared/components/header/header.component';
import { UtilsService } from '@src/app/services/utils.service';

export function getWebsiteMenuItems(utils: UtilsService): HeaderMenuItem[] {
  return [
    {
      label: 'about',
      route: '/about',
      action: () => utils.navigateTo('about'),
      hasChildren: true,
      children: [
        {
          label: 'mission_vision',
          route: '/about/mission-vision',
          action: () => utils.navigateTo('about/mission-vision'),
        },
        {
          label: 'SDL',
          route: '/about/sdl',
          action: () => utils.navigateTo('about/sdl'),
          hidden: true,
        },
        {
          label: 'statute',
          route: '/about/statute',
          action: () => utils.navigateTo('about/statute'),
          hidden: true,
        },
        {
          label: 'history',
          route: '/history',
          action: () => utils.navigateTo('history'),
        },
      ],
    },

    {
      label: 'organization',
      route: '/organization',
      hasChildren: true,
      children: [
        {
          label: 'president',
          route: '/organization/president',
          action: () => utils.navigateTo('organization/president'),
        },
        {
          label: 'vice_president',
          route: '/organization/vice-president',
          action: () => utils.navigateTo('organization/vice-president'),
        },
        {
          label: 'secretary_general',
          route: '/organization/secretary-general',
          action: () => utils.navigateTo('organization/secretary-general'),
        },
        {
          label: 'central_committee',
          route: '/organization/central-committee',
          action: () => utils.navigateTo('organization/central-committee'),
        },
      ],
    },
    {
      label: 'news',
      route: '/news',
      action: () => utils.navigateTo('news'),
      hasChildren: true,
      children: [
        {
          label: 'news_and_announcements',
          route: '/news',
          action: () => utils.navigateTo('news'),
        },
        {
          label: 'videos',
          route: '/videos',
          action: () => utils.navigateTo('videos'),
        },
      ],
    },
    {
      label: 'public_information',
      route: '/public-information',
      hasChildren: true,
      children: [
        {
          label: 'public_statute',
          route: '/public-information/statute',
          action: () => utils.navigateTo('public-information/statute'),
        },
        {
          label: 'party_bodies',
          route: '/public-information/party-bodies',
          action: () => utils.navigateTo('public-information/party-bodies'),
        },
        {
          label: 'programs',
          route: '/public-information/programs',
          action: () => utils.navigateTo('public-information/programs'),
        },
        {
          label: 'financial_reports',
          route: '/public-information/financial-reports',
          action: () => utils.navigateTo('public-information/financial-reports'),
        },
        {
          label: 'contact_person',
          route: '/public-information/contact-person',
          action: () => utils.navigateTo('public-information/contact-person'),
        },
        {
          label: 'income_expenditure',
          route: '/public-information/income-expenditure',
          action: () => utils.navigateTo('public-information/income-expenditure'),
        },
      ],
    },
    {
      label: 'contact',
      route: '/contact',
      action: () => utils.navigateTo('contact'),
    },
  ];
}
