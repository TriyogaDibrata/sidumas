import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../search/search.module').then(m => m.SearchPageModule),
              runGuardsAndResolvers: "always",
              canActivate : [AuthGuard]
          }
        ]
      },
      {
        path: 'lapor-kategori',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../lapor-kategori/lapor-kategori.module').then(m => m.LaporKategoriPageModule),
              runGuardsAndResolvers: "always",
              canActivate : [AuthGuard]
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../notifications/notifications.module').then(m => m.NotificationsPageModule),
              runGuardsAndResolvers: "always",
              canActivate : [AuthGuard]
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule),
              runGuardsAndResolvers: "always",
              canActivate : [AuthGuard]
          }
        ]
      },
      {
        path: 'project',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../project/project.module').then(m => m.ProjectPageModule),
              runGuardsAndResolvers: "always",
              canActivate : [AuthGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
