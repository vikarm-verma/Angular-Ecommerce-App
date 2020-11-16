import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProductserviceService } from '../service/productservice.service';
import { AddproductComponent } from '../admincrud/addproduct/addproduct.component';
import { HttpClient } from '@angular/common/http';
import { CartserviceService } from '../service/cartservice.service';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-productslist',
  templateUrl: './productslist.component.html',
  styleUrls: ['./productslist.component.css']
  
})
@ViewChild(DataTableDirective)
export class ProductslistComponent implements OnInit {

  productId: any;
  productName: any;
  productCategory: any;
  productDescription: any;
  productPrice: any;
  unitInStock: any;
  productImage: any;
  productsArray: any = [];
  imageUrl: any;
  role: any;
  quantity: any = 0;
  addToCart: boolean = false;
  totalPrice: any = 0
  showSnipper: boolean;
  isViewProduct: boolean = false;
  
 // dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isUserNull:boolean=false;
  //dtTrigger: Subject<any> = new Subject();

  constructor(private productService: ProductserviceService,
      private router: Router,
      private sanitizer: DomSanitizer,
      private dialog: MatDialog,
      private cartService: CartserviceService) {
      this.role = sessionStorage.getItem("role");
      this.isViewProduct = false;
      this.productService.getAllProducts().subscribe(res => {
      this.productsArray = res['response']});
      this.cartService.getAllCartItems().subscribe(res => {
      this.cartArray = res['response'];
      //console.log("product id is "+this.productId);    
      });
      if(sessionStorage.getItem("regId")==null)
this.isUserNull=true;
  }

  getProducts() {
    this.isViewProduct=false;
    this.productService.getAllProducts().subscribe(res => {
      this.productsArray = res['response'];
    //  this.dtTrigger.next();
      for (let prdArray of this.productsArray) {
        this.productId = prdArray.product_id;
        this.productName = prdArray.product_name;
        this.productCategory = prdArray.product_category;
        this.productDescription = prdArray.product_description;
        this.productPrice = prdArray.product_price;
        this.unitInStock = prdArray.unit_in_stock;
        this.imageUrl = "http://localhost:3000/" + prdArray.product_image;
      }
    },
    (err) => {
      console.log('-----> err', err)});
  }


  sniper() {
    //this.isViewProduct = false;
    this.showSnipper = true;
    setTimeout(() => {
      this.showSnipper = false;
      this.getProducts();
    }, 1000);
  }

  ngOnInit(): void {
    this.sniper();
  console.log("ng on init called");
  }


  getSantizeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:3000/" + url);
  }

  viewProduct(productId: number) {
    this.isViewProduct = true;
    console.log('view product called' + productId);
    this.productService.getProductById(productId).subscribe(res => {
      this.imageUrl = null;
      this.productsArray = res['response'];
      for (let prdArray of this.productsArray) {
        this.productId = prdArray.product_id;
        this.productName = prdArray.product_name;
        this.productCategory = prdArray.product_category;
        this.productDescription = prdArray.product_description;
        this.productPrice = prdArray.product_price;
        this.unitInStock = prdArray.unit_in_stock;
        this.imageUrl = "http://localhost:3000/" + prdArray.product_image;
      }
    });
  }

  increaseQuantity() {
    if (this.unitInStock != 0) {
      this.unitInStock = this.unitInStock - 1;
      this.quantity = this.quantity + 1;
      this.totalPrice = (this.quantity * this.productPrice);
      this.productService.updateProductUnitOnly(this.productId, this.unitInStock).subscribe();
    }
  }

  decreaseQuantity() {
    if (this.quantity != 0) {
      this.quantity = this.quantity - 1;
      this.unitInStock = this.unitInStock + 1;
      this.totalPrice = (this.quantity * this.productPrice);
      this.productService.updateProductUnitOnly(this.productId, this.unitInStock).subscribe();
    }
  }

  editProduct(productId: number) {
    this.router.navigate(["/admin/addproduct"], { queryParams: { productId: productId } });
  }

  deleteProduct(id: number) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete Record',
        message: 'Are you sure, you want to delete a product record ? '
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.productService.deleteProduct(id).subscribe((data) => console.log(data));
        const alertDialog = this.dialog.open(AlertDialogComponent, {
          data: {
            title: "PRODUCT DELETED",
          }
        });

        alertDialog.afterClosed().subscribe(result => {
          if (result === true) {
            location.reload();
          }
        });

      }
    });
  }

  cancelMethod() {
    this.isViewProduct = false;
 this.ngOnInit();
  }

  cartArray: any = [];
  cartItemId: any = 0;
  cartProductId: any = 0;
  cartItemQuantity: any = 0;
  cartItemTotalPrice: any = 0;
  cartProductIdArray: any = [];
  isProductIdMatched: boolean = false;


  //this logic says if you want to add an item to cart ,cart item should incremented at the same time ,
  //unit_in_stock from productslist should be decremented , while doing this calculating total price too.
  // and updating the cart when item is already present there without adding same item in new row 
  addProductToCart() {
    for (var i = 0; i < this.cartArray.length; i++) {
      this.cartProductId = 1;
      if (this.cartArray[i].product_id == this.productId && this.cartArray[i].user_reg_id == sessionStorage.getItem("regId")) {
        this.isProductIdMatched = true;
        console.log("update " + this.productId + "==============" + this.cartArray[i].product_id);
        this.cartArray[i].quantity = this.cartArray[i].quantity + this.quantity;
        this.cartArray[i].total_price = this.cartArray[i].total_price + this.totalPrice;
        console.log(this.cartArray[i].quantity + "========" + this.cartArray[i].total_price);
        this.cartService.updateCart(this.cartItemId, sessionStorage.getItem("regId"),
        this.productId, this.cartArray[i].quantity,
        this.cartArray[i].total_price).subscribe();
        console.log("after updating cart before break");
        break;
      }
      else {
        this.isProductIdMatched = false;
      }
    }
    //this condition says if product id is not there among products list , so kindly add a new record in cart.With proper
    //calculation in every entity
    if (this.isProductIdMatched == false || this.cartProductId == 0) {
    this.cartService.addCartItem(this.productId, sessionStorage.getItem("regId"),
    this.quantity, this.totalPrice, this.productPrice, this.productName, this.productCategory,
    this.productDescription, this.quantity, this.imageUrl).subscribe();
    console.log("new data inserted into cart");
    }
    //  this.cartService.addToCart(product);
    this.router.navigate(['/user/cart']);
  }
}