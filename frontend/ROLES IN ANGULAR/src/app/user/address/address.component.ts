import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { json } from 'express';
import { AddressService } from 'src/app/service/address.service';
import { CartserviceService } from 'src/app/service/cartservice.service';
import { InvoiceService } from 'src/app/service/invoice.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  //more than one space is not allowed between two words
  uNamePattern = "^[a-zA-Z]+([ ][a-zA-Z]+)?$";

  mNumberPattern = "[0-9]{6}";
  addressForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.pattern(this.uNamePattern)]),
    street1: new FormControl('', Validators.required),
    street2: new FormControl('', Validators.required),
    city: new FormControl('', [Validators.required, Validators.pattern(this.uNamePattern)]),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', [Validators.required, Validators.pattern(this.mNumberPattern)])
  })

  get fullName() {
    return this.addressForm.get('fullName');
  }
  get street1() {
    return this.addressForm.get('street1');
  }
  get street2() {
    return this.addressForm.get('street2');
  }
  get city() {
    return this.addressForm.get('city');
  }
  get state() {
    return this.addressForm.get('state');
  }
  get zip() {
    return this.addressForm.get('zip');
  }

  userAddressArray: any = [];
  isUpdate: boolean = false;
  toggleText: any = 'next';
  addressId: any;
  cartArray: any = [];
  grandTotal: any = 0;
  itemName: any;
  quantity: any;
  unitPrice: any;
  totalPrice: any;
  invoiceArray: any;
  invoiceUser: any;
  wholeFormValue: any;
  constructor(private addressService: AddressService,
    private invoiceService: InvoiceService,
    private cartService: CartserviceService) {
    this.invoiceService.getInvoiceById(sessionStorage.getItem("regId")).subscribe(res => {
      this.invoiceArray = res['response'];
      console.log("before invoice for" + this.invoiceArray);
      for (let ia of this.invoiceArray) {
        this.invoiceUser = ia.user_reg_id;
        if (ia.user_reg_id == sessionStorage.getItem("regId")) {
          console.log("user found in ivoice table");
        }
        else {
          console.log("user not found in invoice table");
        }
      }

    })


    console.log("grand total = " + this.grandTotal);
    this.addressService.getAddressById(sessionStorage.getItem("regId")).subscribe(res => {
      this.userAddressArray = res['response'];
      for (let userAddr of this.userAddressArray) {
        if (userAddr.user_reg_id == sessionStorage.getItem("regId")) {
          this.addressId = userAddr.address_id;
          this.isUpdate = true;
          this.toggleText = this.isUpdate ? 'update' : 'next';
          console.log("address id is " + JSON.stringify(this.addressId));
        }
        else {
          this.isUpdate = false;

        }
        this.addressForm.controls.fullName.setValue(userAddr.full_name),
          this.addressForm.controls.street1.setValue(userAddr.street_address_1),
          this.addressForm.controls.street2.setValue(userAddr.street_address_2),
          this.addressForm.controls.city.setValue(userAddr.city),
          this.addressForm.controls.state.setValue(userAddr.state),
          this.addressForm.controls.zip.setValue(userAddr.zip_code)
      }
    })

  }
  ngOnInit(): void {
    //  throw new Error('Method not implemented.');
  }
  insertAddress() {
    this.wholeFormValue = this.addressForm.controls.fullName.value + ","
      + this.addressForm.controls.street1.value + "," +
      this.addressForm.controls.street2.value + "," +
      this.addressForm.controls.city.value + "," +
      this.addressForm.controls.state.value + "," +
      this.addressForm.controls.zip.value;

    if (this.isUpdate == false && this.invoiceUser == null) {
      this.addressService.setAddress(sessionStorage.getItem("regId"),
        this.addressForm.controls.fullName.value, this.addressForm.controls.street1.value,
        this.addressForm.controls.street2.value, this.addressForm.controls.city.value,
        this.addressForm.controls.state.value, this.addressForm.controls.zip.value).subscribe();
      console.log("before setting address");
      // location.reload();

//after inserting address sending whole  products with calculation to invoice where in invoice a user
//can easily get to know that is invoice correct or not.

      console.log("add id " + this.addressId);
      this.cartService.getCartItemById(sessionStorage.getItem("regId")).subscribe(res => {
        this.cartArray = res['response'];
        console.log(JSON.stringify(this.cartArray));
        for (let ca of this.cartArray) {
          this.grandTotal = this.grandTotal + ca.total_price;
          console.log("in insert address  " + this.addressId);
          this.invoiceService.setInvoice(sessionStorage.getItem("regId"), this.wholeFormValue,
            new Date(), this.grandTotal).subscribe();
          console.log("after inserting address ")
        }
      });


      window.alert("address and invoice isnerted");
    }
  }


//can update user address ,if address is already there in table , means when a user chose any item and 
//user's cart is carrying an item and some how user did not check out the order , so item/s will remain same
//in cart.and address form wil fetch address details from its table

  updateAddress1() {
    this.wholeFormValue = this.addressForm.controls.fullName.value + ","
      + this.addressForm.controls.street1.value + "," +
      this.addressForm.controls.street2.value + "," +
      this.addressForm.controls.city.value + "," +
      this.addressForm.controls.state.value + "," +
      this.addressForm.controls.zip.value;

    console.log("check invoice user " + this.invoiceUser)
    if (this.invoiceUser == null) {
      this.cartService.getCartItemById(sessionStorage.getItem("regId")).subscribe(res => {
        this.cartArray = res['response'];
        for (let ca of this.cartArray) {
          this.grandTotal = this.grandTotal + ca.total_price;
          this.invoiceService.setInvoice(sessionStorage.getItem("regId"), this.wholeFormValue,
            new Date(), this.grandTotal).subscribe();
        }
      })
      this.addressService.updateAddress(sessionStorage.getItem("regId"),
        this.addressForm.controls.fullName.value, this.addressForm.controls.street1.value,
        this.addressForm.controls.street2.value, this.addressForm.controls.city.value,
        this.addressForm.controls.state.value, this.addressForm.controls.zip.value).subscribe();
    }

    else if (this.isUpdate == true && this.invoiceUser != null) {
      this.wholeFormValue = this.addressForm.controls.fullName.value + ","
        + this.addressForm.controls.street1.value + "," +
        this.addressForm.controls.street2.value + "," +
        this.addressForm.controls.city.value + "," +
        this.addressForm.controls.state.value + "," +
        this.addressForm.controls.zip.value;

      console.log("in else if");
      this.addressService.updateAddress(sessionStorage.getItem("regId"),
        this.addressForm.controls.fullName.value, this.addressForm.controls.street1.value,
        this.addressForm.controls.street2.value, this.addressForm.controls.city.value,
        this.addressForm.controls.state.value, this.addressForm.controls.zip.value).subscribe();

      this.cartService.getCartItemById(sessionStorage.getItem("regId")).subscribe(res => {
        this.cartArray = res['response'];
        console.log(JSON.stringify(this.cartArray));
        for (let ca of this.cartArray) {
          console.log("in for loop");
          this.grandTotal = this.grandTotal + ca.total_price;
          console.log("in update invoice " + this.grandTotal);
          this.invoiceService.updateInvoice(this.wholeFormValue, new Date, this.grandTotal, sessionStorage.getItem("regId")).subscribe();
          console.log("after updating invoice")
        }
      })
    }

  }
}


