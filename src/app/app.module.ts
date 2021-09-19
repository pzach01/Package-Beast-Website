import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor, UnitsPipe, SubscriptionGuard, TermsOfServiceGuard } from './_helpers';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

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
import { MatExpansionModule } from '@angular/material/expansion';
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
// import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { TermsOfServiceDialogComponent } from './_components/terms-of-service-dialog/terms-of-service-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { PrivacyPolicyDialogComponent } from './_components/privacy-policy-dialog/privacy-policy-dialog.component';
import { AuthenticatedRedirectGuard } from "./_helpers/authenticated-redirect.guard";
import { ReviewPaymentDialogComponent } from './_components/review-payment-dialog/review-payment-dialog.component';
import { environment } from '../environments/environment';
import { PaymentErrorDialogComponent } from './_components/payment-error-dialog/payment-error-dialog.component';
import { PaymentMethodChangeSuccessComponent } from './_components/payment-method-change-success/payment-method-change-success.component';
import { SubscriptionDowngradeSuccessComponent } from './_components/subscription-downgrade-success/subscription-downgrade-success.component';
import { EditUserInformationComponent } from './_components/edit-user-information/edit-user-information.component';
import { DemoComponent } from './demo/demo.component'

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { WeightUnitsPipe } from './_helpers/weight-units.pipe';
import { ShipFromComponent } from './_components/ship-from/ship-from.component';
import { ShipToComponent } from './_components/ship-to/ship-to.component';
import { QuoteListComponent } from './_components/quote-list/quote-list.component';
import { ArrangementDetailComponent } from './_components/arrangement-detail/arrangement-detail.component';
import { ShippoOauthRedirectComponent } from './_components/shippo-oauth-redirect/shippo-oauth-redirect.component';
import { ConfirmLabelCreationDialogComponent } from './confirm-label-creation-dialog/confirm-label-creation-dialog.component';
import { RefreshQuoteDialogComponent } from './_components/refresh-quote-dialog/refresh-quote-dialog.component';

const appRoutes: Routes = [
  //Routes that do NOT REQUIRE authentication
  //Authentication redirect guard redirects to dashboard if user is authenticated
  { path: '', component: RegisterComponent, canActivate: [AuthenticatedRedirectGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthenticatedRedirectGuard] },
  { path: 'register', redirectTo: '' },
  { path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full', canActivate: [AuthenticatedRedirectGuard] },
  { path: 'reset-password/done', component: ResetPasswordDoneComponent, pathMatch: 'full', canActivate: [AuthenticatedRedirectGuard] },
  { path: 'reset-password/complete', component: ResetPasswordCompleteComponent, pathMatch: 'full', canActivate: [AuthenticatedRedirectGuard] },
  { path: 'reset-password/confirm/:uid/:token', component: ResetPasswordConfirmComponent, pathMatch: 'full', canActivate: [AuthenticatedRedirectGuard] },
  { path: 'confirm-email/:key', component: ConfirmEmailComponent, pathMatch: 'full', canActivate: [AuthenticatedRedirectGuard] },
  { path: 'register-done', component: RegisterDoneComponent, pathMatch: 'full', canActivate: [AuthenticatedRedirectGuard] },
  { path: 'shippo-oauth-redirect', component: ShippoOauthRedirectComponent, pathMatch: 'full', canActivate: [] },

  //Routes that REQUIRE authentication
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'shipments',
    outlet: 'view',
    canActivate: [AuthGuard, SubscriptionGuard, TermsOfServiceGuard],
    children: [
      { path: '', component: ShipmentsComponent },
      { path: 'new', component: NewShipmentComponent }
    ]
  },
  {
    path: 'shipments/:id',
    outlet: 'view',
    canActivate: [AuthGuard, SubscriptionGuard, TermsOfServiceGuard],
    children: [
      { path: '', component: ShipmentDetailComponent },
      { path: 'quotes', component: QuoteListComponent },
      { path: 'quotes/:quoteId', component: ArrangementDetailComponent }
    ]
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
    path: 'subscription-downgrade-success',
    outlet: 'view',
    component: SubscriptionDowngradeSuccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-method-change-success',
    outlet: 'view',
    component: PaymentMethodChangeSuccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment/:subscriptionType',
    outlet: 'view',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-user-information',
    outlet: 'view',
    component: EditUserInformationComponent,
    canActivate: [AuthGuard, TermsOfServiceGuard]
  },
  {
    path: 'change-password',
    outlet: 'view',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard, TermsOfServiceGuard]
  },
  { path: "**", redirectTo: '' }
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
    PrivacyPolicyDialogComponent,
    ReviewPaymentDialogComponent,
    PaymentErrorDialogComponent,
    PaymentMethodChangeSuccessComponent,
    SubscriptionDowngradeSuccessComponent,
    EditUserInformationComponent,
    DemoComponent,
    WeightUnitsPipe,
    ShipFromComponent,
    ShipToComponent,
    QuoteListComponent,
    ArrangementDetailComponent,
    ShippoOauthRedirectComponent,
    ConfirmLabelCreationDialogComponent,
    RefreshQuoteDialogComponent],
  imports: [
    // MatCarouselModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, scrollPositionRestoration: 'enabled',
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
    MatExpansionModule,
    FontAwesomeModule,
    MatSliderModule,
    MatProgressBarModule,
    MatMenuModule,
    SocialLoginModule,
    NgxStripeModule.forRoot(environment.stripePublishableKey),
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
    ShipmentAlertComponent,
    CancelSubscriptionConfirmationComponent,
    ReviewPaymentDialogComponent,
    PaymentErrorDialogComponent,
    ChangePasswordCompleteDialogComponent,
    ConfirmLabelCreationDialogComponent,
    RefreshQuoteDialogComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LfXg8wZAAAAAL481GmZ10s8aADR_-poyzCHRrcG' },
    DatePipe,
    UnitsPipe,
    VolumeUnitsPipe,
    DecimalPipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.GOOGLE_CLIENT_ID_URI
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
