import { HeaderMenuItem } from '@src/app/shared/components/header/header.component';
import { UtilsService } from '@src/app/services/utils.service';

export function getWebsiteMenuItems(utils: UtilsService): HeaderMenuItem[] {
  return [
    {
      label: 'home',
      route: '/',
      action: () => utils.navigateTo(''),
    },
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
          label: 'organization',
          route: '/about/organization',
          action: () => utils.navigateTo('about/organization'),
        },
        {
          label: 'statute',
          route: '/about/statute',
          action: () => utils.navigateTo('about/statute'),
        },
      ],
    },
    {
      label: 'news',
      route: '/news',
      action: () => utils.navigateTo('news'),
    },
    {
      label: 'contact',
      route: '/contact',
      action: () => utils.navigateTo('contact'),
    },
  ];
}
