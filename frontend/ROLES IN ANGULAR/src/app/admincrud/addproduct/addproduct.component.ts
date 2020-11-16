import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';
import { FileUploader } from 'ng2-file-upload';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ProductserviceService } from 'src/app/service/productservice.service';
import { ProfileserviceService } from 'src/app/service/profileservice.service';
import { UserService } from 'src/app/service/UserService';

const URL = "http://localhost:3000/api/uploadprdimage";

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})

export class AddproductComponent implements OnInit {

  uploader: FileUploader;
  imageUrl: any;
  productsArray: any = [];
  userRegId: any;
  productId: any = -1;
  userEmail: any;
  role: any;
  isUpdate: boolean = false;
  isOldImage: boolean = false;
  isNewImage: boolean = false;
  product_image: any;
  value: any = 0;
  isUpload: any;
  imageShow: any;
  filename: any;
  isFileSelected: boolean = false;
  sLength: any;
  isAgainFileSelected:boolean=false;
  /* name pattern which will allow user to write single name without trailing and leading space 
  and two names with one space in the mid */
  uProductPattern = "^[a-zA-Z]+([ ][a-zA-Z]+)?$";

  /* mobile number accepted if starts with 7 or 8  or 9 follwing 9 digits */
  uNumPattern = "[0-9]*$";

  /* registering controls with validators using required and pattern ,in reactive forms 
  form controls has to register  */

  productForm = new FormGroup({
    productName: new FormControl('', [Validators.required, Validators.pattern(this.uProductPattern)]),
    productCategory: new FormControl('', Validators.required),
    productDescription: new FormControl('', Validators.required),
    productPrice: new FormControl('', [Validators.required, Validators.pattern(this.uNumPattern)]),
    unitInStock: new FormControl('', [Validators.required, Validators.pattern(this.uNumPattern)]),
    productImage: new FormControl(),
  });

  /* when this component loads it will show user's profile data if present else blank for would be there */
  constructor(private http: HttpClient,
    private productService: ProductserviceService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private route: ActivatedRoute) {
    this.sLength = sessionStorage.length;
    this.userEmail = sessionStorage.getItem("email");
    this.role = sessionStorage.getItem("role");
    this.userRegId = sessionStorage.getItem("regId");
    console.log("constructor called of add product");

    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        this.productId = params.productId;

        console.log("checking " + this.productId); // popular
        if (this.productId == undefined) {
          console.log("in if");
          this.isOldImage = false;
          this.isNewImage = true;
          this.isUpdate = false;
          this.productForm.reset();

        }
      }
      );
    if (this.productId >= 1) {
      this.isUpdate = true;
      this.isFileSelected =false;
      this.productService.getProductById(this.productId).subscribe(res => {
        this.isNewImage = false

        this.isOldImage = true
        this.imageUrl=null;
        this.isUpload = !this.isUpload;
        this.productsArray = res['response'];
        for (let prdArray of this.productsArray) {
          // this.productId = prdArray.product_id;
          this.productId = prdArray.product_id;
          this.productForm.controls.productName.setValue(prdArray.product_name);
          this.productForm.controls.productCategory.setValue(prdArray.product_category);
          this.productForm.controls.productDescription.setValue(prdArray.product_description);
          this.productForm.controls.productPrice.setValue(prdArray.product_price);
          this.productForm.controls.unitInStock.setValue(prdArray.unit_in_stock);
          this.imageUrl = "http://localhost:3000/" + prdArray.product_image;
            console.log(this.imageUrl+"======="+prdArray.product_image);
            
            

        }

      });

    }


  }

  /* after registration for validating this will return control nome to the template's property */
  get productName() {
    return this.productForm.get('productName');
  }
  get productCategory() {
    return this.productForm.get('productCategory');
  }
  get productDescription() {
    return this.productForm.get('productDescription');
  }
  get productPrice() {
    return this.productForm.get('productPrice');
  }
  get unitInStock() {
    return this.productForm.get('unitInStock');
  }

  /* here we are using FileUploader of angular this will be in ngOnInit() only , it will 
  be called by upload.uploadAll() from template when user clicks on upload button of file uploader control 
  */
  ngOnInit(): void {

    console.log("in ng oninit");
    this.uploader = new FileUploader({
      url: URL,
      itemAlias: 'productImage'
    });
    this.uploader.onAfterAddingFile = f => {
      // this will remove all images from your selection and will let remain the latest one 
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
      f.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "IMAGE UPLOADED SUCCESSFULLY",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
        
          this.isUpdate = true;
          //this.isFileSelected = false
    
        }
      });
    };
  }

  /* this will call when you click on browse button of file upload  
  it will show selected image in image control */

  onSelectFile(event) {
    console.log("select file called");
    
    this.isOldImage = false;
    this.isNewImage = true;
    this.isUpdate=false;
    this.isFileSelected = true;
    this.isUpload = true;
    this.product_image = this.productForm.controls.productImage.value;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imageShow = event.target.result;
     
      }
    }
  }

  //this will add user profile to db and image path too
  addProduct() {
    /* if you are filling your profile first time then it will ask for uploading image ,without it 
    it will not not enable submit button */
    console.log("add product called");
    if (this.productForm.controls.productImage.value == null) {
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "SELECT IMAGE",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
          //   this.router.navigate(['\admin\addproduct']);
        }
      });
    }
    else {
      console.log("in else");
      /* here whenever you select an image and stroe it into db column which is of varchar type
      it stores image in the form of path with adding c:\\fakepath ,and later on it will 
      become a complete image name , so here we are removing that pre adder using replace method
      and this will now save image with image name only with its extension */
      var filename = this.productForm.controls.productImage.value.replace("C:\\fakepath\\", "");
      //console.log("=>" + this.productForm.controls.userImage.value + "new value " + filename);
      this.productService.addProduct(
        this.productId,
        this.productForm.controls.productName.value,
        this.productForm.controls.productCategory.value,
        this.productForm.controls.productDescription.value,
        this.productForm.controls.productPrice.value,
        this.productForm.controls.unitInStock.value,
        filename).subscribe();
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "RECORD SAVED",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
          location.reload();
        }
      });
      // console.log("data added" + this.productForm.value);
      // this.isUpdate = !this.isUpdate;
      this.router.navigate(['/productlist']);
    }
  }

  getSantizeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  /* this is for updating profile ,controls will be filled up when we come to page first
  it will do uploading task ,if you do not change image then same image will be there in db and static folder
 */
  isEditProduct: boolean = false;
  public onUpdateProduct() {

    //this.isUpdate = false;

    if (this.isFileSelected) {
      this.filename = this.productForm.controls.productImage.value.replace("C:\\fakepath\\", "");
    }
    else if (this.isFileSelected==false) {

      this.filename = this.imageUrl.replace("http://localhost:3000/", "");

    }
    
    //var filename = this.productForm.controls.productImage.value.replace("C:\\fakepath\\", "");
    
      console.log("in service update product " + this.productId);
      this.productService.updateProduct(
        this.productId,
        this.productForm.controls.productName.value,
        this.productForm.controls.productCategory.value,
        this.productForm.controls.productDescription.value,
        this.productForm.controls.productPrice.value,
        this.productForm.controls.unitInStock.value,
        this.filename).subscribe();
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "RECORD UPDATED",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.router.navigate(['/productlist']);
        }
      });
      // console.log("data added" + this.productForm.value);
      // this.isUpdate = !this.isUpdate;

    }


  

}
