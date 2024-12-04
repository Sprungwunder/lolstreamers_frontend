import {Routes} from '@angular/router';
import {StreamerHomeComponent} from "./streamer-home/streamer-home.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {AdminAddVideoComponent} from "./admin-add-video/admin-add-video.component";
import {AdminEditVideoComponent} from "./admin-edit-video/admin-edit-video.component";

export const routes: Routes = [
    {
        path: '',
        component: StreamerHomeComponent,
        title: 'Video Streamers Home'
    },
    {
        path: 'admin',
        component: AdminHomeComponent,
        title: 'Admin Home'
    },
    {
        path: 'admin/add',
        component: AdminAddVideoComponent,
        title: 'Admin Add Video'
    },
    {
        path: 'admin/edit/:id',
        component: AdminEditVideoComponent,
        title: 'Admin Edit Video'
    }
];
