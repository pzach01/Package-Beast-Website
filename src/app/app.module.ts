import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor, UnitsPipe } from './_helpers';
import { CommonModule, DatePipe } from '@angular/common';

import { AppComponent } from "./app.component";
import { LoginComponent } from "./_components/login"
import { RegisterComponent } from "./_components/register"
import { AuthGuard } from './_helpers';
import { AlertComponent } from './_components/alert';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ItemsComponent } from './_components/items/items.component';
import { ContainersComponent } from './_components/containers/containers.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { ShipmentsComponent } from './_components/shipments/shipments.component';
import { NewItemComponent } from './_components/new-item/new-item.component';
import { MatDialogModule } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NewContainerComponent } from './_components/new-container/new-container.component';
import { NewShipmentComponent } from './_components/new-shipment/new-shipment.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { ItemsSelectionComponent } from './_components/items-selection/items-selection.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContainersSelectionComponent } from './_components/containers-selection/containers-selection.component';
import { EditItemComponent } from './_components/edit-item/edit-item.component';
import { EditContainerComponent } from './_components/edit-container/edit-container.component';
import { ReviewShipmentComponent } from './_components/review-shipment/review-shipment.component';
import { ShipmentDetailComponent } from './_components/shipment-detail/shipment-detail.component';
import { RenderingComponent } from './_components/rendering/rendering.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BillingComponent } from './_components/billing/billing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSliderModule } from '@angular/material/slider';
import { VolumeUnitsPipe } from './_helpers';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentComponent } from './_components/payment/payment.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'shipments',
    outlet: 'view',
    component: ShipmentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shipments/:id',
    outlet: 'view',
    component: ShipmentDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'items',
    outlet: 'view',
    component: ItemsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'containers',
    outlet: 'view',
    component: ContainersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    outlet: 'view',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'billing',
    outlet: 'view',
    component: BillingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    outlet: 'view',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  { path: "*", redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    ItemsComponent,
    ContainersComponent,
    DashboardComponent,
    SettingsComponent,
    ShipmentsComponent,
    NewItemComponent,
    NewContainerComponent,
    NewShipmentComponent,
    ItemsSelectionComponent,
    ContainersSelectionComponent,
    EditItemComponent,
    EditContainerComponent,
    ReviewShipmentComponent,
    ShipmentDetailComponent,
    RenderingComponent,
    BillingComponent,
    UnitsPipe,
    VolumeUnitsPipe,
    PaymentComponent],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true, scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      } // <-- debugging purposes only
    ),
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatSliderModule,
    MatProgressBarModule,
    NgxStripeModule.forRoot('pk_test_R4nhryC8mNzBKx7xVmqHvMaP00nJyQoTdD'),
  ],
  entryComponents: [
    NewItemComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
