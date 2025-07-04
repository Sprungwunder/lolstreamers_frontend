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
    title: 'League of Legends Streamers Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'League of Legens Streamers Login'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'League of Legengs Streamers Contact'
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    title: 'LS Streamers Admin Home',
    canActivate: [authFunctionalGuard],
  },
  {
    path: 'admin/add',
    component: AdminAddVideoComponent,
    title: 'LS Streamers Admin Add Video',
    canActivate: [authFunctionalGuard],
  },
  {
    path: 'admin/edit/:id',
    component: AdminEditVideoComponent,
    title: 'LS Streamers Admin Edit Video',
    canActivate: [authFunctionalGuard],
  }
];
