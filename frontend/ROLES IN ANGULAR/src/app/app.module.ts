import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AppRoutingModule, RoutingComponent } from './routing-module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdmincrudComponent } from './admincrud/admincrud.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './user/user.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AddnewuserComponent } from "./admincrud/addnewuser/addnewuser.component";
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { DataTablesModule } from 'angular-datatables';
import { AddproductComponent } from './admincrud/addproduct/addproduct.component';
import { ProductslistComponent } from './productslist/productslist.component';
import { ProductinventoryComponent } from './admincrud/addproduct/productinventory/productinventory.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CartComponent } from './user/cart/cart.component';
import { AddressComponent } from './user/address/address.component';
import { InvoiceComponent } from './user/invoice/invoice.component';
import { PaymentformComponent } from './user/paymentform/paymentform.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactusComponent,
    RoutingComponent,
    LoginComponent,
    RegisterComponent,
    AdmincrudComponent,
    UserComponent,
    HeaderComponent,
    ProfileComponent,
    AddnewuserComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    AddproductComponent,
    ProductslistComponent,
    ProductinventoryComponent,
    CartComponent,
    AddressComponent,
    InvoiceComponent,
    PaymentformComponent,

    //AngularRaveModule
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FileUploadModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTooltipModule,
    DataTablesModule,
    NgxImageZoomModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatCheckboxModule,
    NgxImageZoomModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  providers: [HeaderComponent,AddproductComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
