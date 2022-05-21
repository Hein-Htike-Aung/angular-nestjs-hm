import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PrivateComponent } from './private.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'employee',
        loadChildren: () =>
          import('../employee/employee.module').then((m) => m.EmployeeModule),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('../invoice/invoice.module').then((m) => m.InvoiceModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
