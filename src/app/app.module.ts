import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor, UnitsPipe, SubscriptionGuard, TermsOfServiceGuard } from './_helpers';
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
import { ResetPasswordComponent } from './_components/reset-password/reset-password.component';
import { ResetPasswordDoneComponent } from './_components/reset-password-done/reset-password-done.component';
import { ResetPasswordConfirmComponent } from './_components/reset-password-confirm/reset-password-confirm.component';
import { ResetPasswordCompleteComponent } from './_components/reset-password-complete/reset-password-complete.component';
import { ChangePasswordComponent } from './_components/change-password/change-password.component';
import { ConfirmEmailComponent } from './_components/confirm-email/confirm-email.component';
import { RegisterDoneComponent } from './_components/register-done/register-done.component';
import { SelectSubscriptionComponent } from './_components/select-subscription/select-subscription.component';
import { PaymentSuccessComponent } from './_components/payment-success/payment-success.component';
import { ShipmentAlertComponent } from './_components/shipment-alert/shipment-alert.component';
import { CancelSubscriptionConfirmationComponent } from './_components/cancel-subscription-confirmation/cancel-subscription-confirmation.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { CreateFailDialogComponent } from './_components/create-fail-dialog/create-fail-dialog.component';
import { ConfirmDeleteDialogComponent } from './_components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ChangePasswordCompleteDialogComponent } from './_components/change-password-complete-dialog/change-password-complete-dialog.component';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { TermsOfServiceDialogComponent } from './_components/terms-of-service-dialog/terms-of-service-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { PrivacyPolicyDialogComponent } from './_components/privacy-policy-dialog/privacy-policy-dialog.component';
import { AuthenticatedRedirectGuard } from "./_helpers/authenticated-redirect.guard";

const appRoutes: Routes = [
  { path: '', component: RegisterComponent, canActivate: [AuthenticatedRedirectGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full' },
  { path: 'reset-password/done', component: ResetPasswordDoneComponent, pathMatch: 'full' },
  { path: 'reset-password/complete', component: ResetPasswordCompleteComponent, pathMatch: 'full' },
  { path: 'reset-password/confirm/:uid/:token', component: ResetPasswordConfirmComponent, pathMatch: 'full' },
  { path: 'confirm-email/:key', component: ConfirmEmailComponent, pathMatch: 'full' },
  { path: 'register-done', component: RegisterDoneComponent, pathMatch: 'full' },

  {
    path: 'shipments',
    outlet: 'view',
    component: ShipmentsComponent,
    canActivate: [AuthGuard, SubscriptionGuard, TermsOfServiceGuard]
  },
  {
    path: 'shipments/:id',
    outlet: 'view',
    component: ShipmentDetailComponent,
    canActivate: [AuthGuard, SubscriptionGuard, TermsOfServiceGuard]
  },
  {
    path: 'inventory',
    outlet: 'view',
    component: ItemsComponent,
    canActivate: [AuthGuard, SubscriptionGuard, TermsOfServiceGuard]
  },
  {
    path: 'containers',
    outlet: 'view',
    component: ContainersComponent,
    canActivate: [AuthGuard, SubscriptionGuard, TermsOfServiceGuard]
  },
  {
    path: 'settings',
    outlet: 'view',
    component: SettingsComponent,
    canActivate: [AuthGuard, SubscriptionGuard, TermsOfServiceGuard]
  },
  {
    path: 'billing',
    outlet: 'view',
    component: BillingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'select-subscription',
    outlet: 'view',
    component: SelectSubscriptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-success',
    outlet: 'view',
    component: PaymentSuccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment/:subscriptionType',
    outlet: 'view',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    outlet: 'view',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard, TermsOfServiceGuard]
  },
  { path: "*", redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterDoneComponent,
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
    PaymentComponent,
    ResetPasswordComponent,
    ResetPasswordDoneComponent,
    ResetPasswordConfirmComponent,
    ResetPasswordCompleteComponent,
    ChangePasswordComponent,
    ConfirmEmailComponent,
    SelectSubscriptionComponent,
    PaymentSuccessComponent,
    ShipmentAlertComponent,
    CancelSubscriptionConfirmationComponent,
    CreateFailDialogComponent,
    ConfirmDeleteDialogComponent,
    ChangePasswordCompleteDialogComponent,
    TermsOfServiceDialogComponent,
    PrivacyPolicyDialogComponent],
  imports: [
    MatCarouselModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true, scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      } // <-- debugging purposes only
    ),
    RecaptchaModule,
    RecaptchaV3Module,
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
    MatMenuModule,
    NgxStripeModule.forRoot('pk_test_51HB4dCJWFTMXIZUoYKkeexdRBZ9Sf2VXPhXUWI5MAqScPKKUgc7hGuzURITCaIaJsvuG61pPBodhi87hSKDAIRRz00HCwjqKVH'),
  ],
  entryComponents: [
    NewItemComponent,
    NewContainerComponent,
    NewShipmentComponent,
    TermsOfServiceDialogComponent,
    PrivacyPolicyDialogComponent,
    EditContainerComponent,
    EditItemComponent,
    ShipmentDetailComponent,
    ConfirmDeleteDialogComponent,
    CreateFailDialogComponent,
    ShipmentAlertComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LfXg8wZAAAAAL481GmZ10s8aADR_-poyzCHRrcG' },
    DatePipe
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
