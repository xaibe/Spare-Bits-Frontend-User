import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../../sdk/core/user.service';
import { AuthService } from '../../../../sdk/core/auth.service';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ToastService } from 'src/sdk/custom/toast.service';
@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.page.html',
  styleUrls: ['./verifyemail.page.scss'],
})
export class VerifyemailPage implements OnInit {

 
  verifyForm: FormGroup;
  fetchedData: void;
  constructor(
    private toastService:ToastService,
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
     private service: UserService,
     private toastController:ToastController) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this.router.navigate(['/forgotpassword']);
    });
   }
  clicked = false;
  hasverified=false;
  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.verifyForm = this.formBuilder.group({
       verificationcode:[null]
    });
  }

subscrib(fetchedData,verifyData){
  this.service.userverifyemail(this.fetchedData,verifyData).subscribe(
    data => {
      const msg="Your Email is verified,Success!";
      this.toastService.presentpositiveToast(msg);
    this.clicked=false;  
     this.router.navigateByUrl('/changepassword');
    },

    error => {      
      
      this.clicked=false;      
      this.toastService.presenterrorToast("Please Enter A Valid Verification Code , Failed!");    
      
    }
    );
    
    
}

  verify(){
try{
  const semail='email';
  this.authService.getTokenFromStorage(semail).then(data => {
    //this.authService.getItemFromStorage(semail).then(data => {
      this.fetchedData = data;

      console.log('token email',this.fetchedData);
      
      this.clicked = true;
      const verifyData = this.verifyForm.value;
      console.log('form text',verifyData);
     
    this.subscrib(this.fetchedData,verifyData);
    })
      .catch(error => { console.log('fethching error',error) });
      }
      catch (ex) {
        console.log('ex', ex);
    } 
}
}