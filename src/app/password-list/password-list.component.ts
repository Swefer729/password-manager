import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

import { AES, enc } from 'crypto-js';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css']
})
export class PasswordListComponent {

  siteId !: string;
  siteName !: string;
  siteURL !: string;
  siteImgURL !: string;

  passwordList !: Array<any>;

  email !: string;
  username !: string;
  password !: string;
  passwordId !: string;

  formState : string = 'Dodaj nowego';

  isSuccess: boolean = false;
  successMessage !: string;

  constructor(private route: ActivatedRoute, private passwordManagerService: PasswordManagerService){

    this.route.queryParams.subscribe((val:any) => {

      this.siteId = val.id;
      this.siteName = val.siteName;
      this.siteURL = val.siteURL;
      this.siteImgURL = val.siteImgURL;

    })

    this.loadPasswords();
  }

  showAlert(message: string){
    this.isSuccess = true;
    this.successMessage = message;
  }

  resetForm(){
    this.email = '';
    this.username = '';
    this.password = '';
    this.formState = 'Dodaj nowego';
  }

  onSubmit(values: any) {

    const encryptedPassword = this.encryptPassword(values.password);
    
    values.password = encryptedPassword;

    if(this.formState == 'Dodaj nowego'){
    this.passwordManagerService.addPassword(values, this.siteId)
    .then(()=> {
      console.log('Hasło zapisane pomyślnie');
      this.showAlert('Dane zapisane pomyślnie');
      this.resetForm();
    })
    .catch (err=> {
      console.log(err);
    })
  } 
  else if(this.formState == 'Edytuj'){
    this.passwordManagerService.updatePassword(this.siteId, this.passwordId, values)
    .then(()=> {
      console.log('Hasło edytowane pomyślnie');
      this.showAlert('Dane edytowane pomyślnie');
      this.resetForm();
    })
    .catch (err=> {
      console.log(err);
    })
}
}

  loadPasswords() {
    this.passwordManagerService.loadPasswords(this.siteId).subscribe(val=> {
      this.passwordList = val;
    });
  }

  editPassword(email: string, username: string, password: string, passwordId: string) {

  this.email = email;
  this.username = username;
  this.password = password;
  this.passwordId = passwordId;

  this.formState = 'Edytuj';

  }

  deletePassword(passwordId: string){
    this.passwordManagerService.deletePassword(this.siteId, this.passwordId)
    .then(()=> {
      console.log('Hasło usunięto pomyślnie');
      this.showAlert('Dane usunięte pomyślnie');
    })
    .catch (err=> {
      console.log(err);
    })
  }

  encryptPassword(password: string) {
    const secretKey = 'E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfU';
    const encryptedPassword = AES.encrypt(password, secretKey).toString();
    return encryptedPassword;
  
  }

  decryptPassword(password: string) {
    const secretKey = 'E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfU';
    const decPassword = AES.decrypt(password, secretKey).toString(enc.Utf8);
    return decPassword;

  }

  onDecrypt(password: string, index: number) {
    const decPassword = this.decryptPassword(password);
    this.passwordList[index].password = decPassword;
  }

}
