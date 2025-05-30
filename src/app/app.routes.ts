import { Routes } from '@angular/router';
import { AdminBaseComponent } from './components/admin-panel/admin-layout/admin-base/admin-base.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { WebsiteBaseComponent } from './components/website/website-base/website-base.component';
import { DashboardComponent } from './components/admin-panel/dashboard/dashboard.component';
import { CourseMasterComponent } from './components/admin-panel/courses/course-master/course-master.component';
import { AuthGuard } from './authGuard/auth.guard';
import { CourseModuleComponent } from './components/admin-panel/courses/course-module/course-module.component';
import { VideoPlayerComponent } from './components/admin-panel/courses/video-player/video-player.component';


export const routes: Routes = [
    {
        path: '', 
        component: WebsiteBaseComponent,
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },    
    {
        path: 'admin', 
        component: AdminBaseComponent,
        children: [
            { path: 'course', component: CourseMasterComponent, canActivate: [AuthGuard] },
            { path: 'module', component: CourseModuleComponent, canActivate: [AuthGuard] },
            { path: 'video', component: VideoPlayerComponent, canActivate: [AuthGuard] },
            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
        ]
    }
];
