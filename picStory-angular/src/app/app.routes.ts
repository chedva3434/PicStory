import { Routes } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { adminGuard } from '../guard/admin.guard';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { UsersComponent } from '../component/users/users.component';


export const routes: Routes = [

    {
      path: 'login',
      component: LoginComponent
    },
  
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
  
    {
      path: '',
      canActivate: [adminGuard],
      children: [
  
        {
          path: 'dashboard',
          component: DashboardComponent
        },
  
        {
          path: 'users',
          component: UsersComponent
        }
  
      ]
    }

];
