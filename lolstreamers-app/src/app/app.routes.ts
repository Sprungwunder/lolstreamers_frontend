import {Routes} from '@angular/router';
import {authFunctionalGuard} from './auth-functional.guard';
import {StreamerHomeComponent} from "./streamer-home/streamer-home.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {AdminAddVideoComponent} from "./admin-add-video/admin-add-video.component";
import {AdminEditVideoComponent} from "./admin-edit-video/admin-edit-video.component";
import {LoginComponent} from "./login/login.component";

export const routes: Routes = [
  {
    path: '',
    component: StreamerHomeComponent,
    title: 'Video Streamers Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    title: 'Admin Home',
    canActivate: [authFunctionalGuard],
  },
  {
    path: 'admin/add',
    component: AdminAddVideoComponent,
    title: 'Admin Add Video',
    canActivate: [authFunctionalGuard],
  },
  {
    path: 'admin/edit/:id',
    component: AdminEditVideoComponent,
    title: 'Admin Edit Video',
    canActivate: [authFunctionalGuard],
  }
];
