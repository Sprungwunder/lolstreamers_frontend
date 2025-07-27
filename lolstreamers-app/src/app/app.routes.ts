import {Routes} from '@angular/router';
import {authFunctionalGuard} from './auth-functional.guard';
import {StreamerHomeComponent} from "./streamer-home/streamer-home.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {AdminAddVideoComponent} from "./admin-add-video/admin-add-video.component";
import {AdminEditVideoComponent} from "./admin-edit-video/admin-edit-video.component";
import {LoginComponent} from "./login/login.component";
import {ContactComponent} from "./contact/contact.component";

export const routes: Routes = [
  {
    path: '',
    component: StreamerHomeComponent,
    title: 'Search The Rift Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Search The Rift Login'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Search The Rift Contact'
  },
  {
    path: 'adm',
    component: AdminHomeComponent,
    title: 'Search The Rift Admin Home',
    canActivate: [authFunctionalGuard],
  },
  {
    path: 'adm/add',
    component: AdminAddVideoComponent,
    title: 'Search The Rift Admin Add Video',
    canActivate: [authFunctionalGuard],
  },
  {
    path: 'adm/edit/:id',
    component: AdminEditVideoComponent,
    title: 'Search The Rift Admin Edit Video',
    canActivate: [authFunctionalGuard],
  }
];
