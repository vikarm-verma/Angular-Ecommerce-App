import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/service/invoice.service';


@Component({
  selector: 'app-paymentform',
  templateUrl: './paymentform.component.html',
  styleUrls: ['./paymentform.component.css']
})
export class PaymentformComponent implements OnInit {
  handler: any = null;
  invoiceArray: any = [];
  grandTotal: any;
  constructor(private invoiceService: InvoiceService) {
    this.invoiceService.getInvoiceById(sessionStorage.getItem("regId")).subscribe(res => {
      this.invoiceArray = res['response'];
      for (let ia of this.invoiceArray) {
        this.grandTotal = ia.grand_total;
        console.log("grand total is " + JSON.stringify(this.grandTotal));
      }

    })
  }
  ngOnInit(): void {
    this.loadStripe();
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      window.document.body.appendChild(s);
    }
  }

  pay(amount) {
    var handler = (<any>window).StripeCheckout.configure({
      //your stripe registred token id would be there
      key: 'pk_test_51HlIAdCXKZaLftQKzEhazQAGVBA8a2zV7QT4wdZAt3DOJ5Yutilhp0GItkPU1HXNHvQiJzhHvIwg0OX7oZvpMJFx00Gdu6HAqY',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token)
        alert('Token Created!!');
      }
    });

    handler.open({
      name: 'The Beginners',
      description: 'New Ecommerce portal',
      amount: amount * 100
    });
  }
}
