import { Component, OnInit } from '@angular/core';
import { AddressService } from 'src/app/service/address.service';
import { CarthistoryService } from 'src/app/service/carthistory.service';
import { CartserviceService } from 'src/app/service/cartservice.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ProfileserviceService } from 'src/app/service/profileservice.service';
import { UsercartService } from 'src/app/service/usercart.service';
import { UserService } from 'src/app/service/UserService';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoiceArray:any=[];
  addressArray:any=[];
  cartArray:any=[];
  grandTotal:any=0;
  showSnipper:boolean=false;
  date:any;
  userArray:any=[];
  constructor(private invoiceService:InvoiceService,
    private cartService:CartserviceService,
    private addressService:AddressService,
    private cartHistoryService:CarthistoryService,
    private userCartService:UsercartService,
    private userProfileService:ProfileserviceService) {
      this.date=new Date();
   this.sniper();  


  
     }

     sniper()
     {
       this.showSnipper=true;
     setTimeout(() => {this.showSnipper=false;
      this.getInvoiceViaId();
     }, 1000);
   }
     
  ngOnInit(): void {
  }
getInvoiceViaId()
{
  this.invoiceService.getInvoiceById(sessionStorage.getItem("regId")).subscribe(res=>
    {
      this.invoiceArray=res['response'];
      for(let ia of this.invoiceArray)
      {
      this.grandTotal=ia.grand_total;
      console.log("grand total is "+JSON.stringify(this.grandTotal));
      }
      
    })
    console.log("grand total is "+JSON.stringify(this.grandTotal));
    this.addressService.getAddressById(sessionStorage.getItem("regId")).subscribe(res=>{
      this.addressArray=res['response'];

    })
    this.userProfileService.getUserProfileById(sessionStorage.getItem("regId")).subscribe(res =>
      {this.userArray=res['response'];
    })
    this.cartService.getCartItemById(sessionStorage.getItem("regId")).subscribe(res=>{
      this.cartArray=res['response'];
    })
    
}

  insertIntoCartHistory()
  {
    console.log("22 grand total is "+this.grandTotal);
    this.cartService.getCartItemById(sessionStorage.getItem("regId")).subscribe(res=>{
      this.cartArray=res['response'];
      for(let ca of this.cartArray)
      {
        console.log("in for loop");
        this.cartHistoryService.addCartHistoryItem(ca.cart_item_id,ca.product_id,ca.user_reg_id,
          ca.quantity,ca.total_price,ca.product_price,ca.product_name,
          ca.product_category,ca.product_description,ca.unit_in_stock,ca.product_image).subscribe();
          console.log("data inserted into cart history");
      }
      this.cartService.deleteWholeCart(sessionStorage.getItem("regId")).subscribe();
    console.log("cart items deleted from cart");
    });
    console.log("outside for loop");
     this.userCartService.addUserCartItem(sessionStorage.getItem("regId"),this.grandTotal).subscribe();
     console.log("data inserted into cart table");

    
   
  }

}
