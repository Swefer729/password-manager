import { Observable } from 'rxjs';
import { PasswordManagerService } from './../password-manager.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent {

allSites!: Observable<Array<any>>;

siteName !: string;
siteURL !: string;
siteImgURL !: string;
siteId !: string;

isSuccess: boolean = false;
successMessage !: string;

addNewPage: boolean = false;

formState: string = "Dodaj nową"

  constructor(private PasswordManagerService: PasswordManagerService){
    this.loadSites();
  }

  showAlert(message: string){
    this.isSuccess = true;
    this.successMessage = message;
  }

  showForm(){
    this.addNewPage = true;
  }

  hideForm(){
    this.addNewPage = false;
  }
  

  resetForm(){
    this.siteName = '';
    this.siteURL = '';
    this.siteImgURL = '';
    this.formState = 'Dodaj nową';
  }

  onSubmit(values: object){

    if(this.formState == "Dodaj nową") {

    
    console.log(values)
    this.PasswordManagerService.addSite(values)
    .then(()=> {
      this.showAlert('Dane zapisane pomyślnie')
      this.resetForm();
      this.hideForm();
    })
    .catch(err => {
      console.log(err);
    })
  }
  else if (this.formState == "Edytuj"){
    this.PasswordManagerService.updateSite(this.siteId, values)
    .then(()=> {
      this.showAlert('Dane edytowane pomyślnie')
      this.resetForm();
      this.hideForm();
    })
    .catch(err => {
      console.log(err);
    })
  }
    
  }

  loadSites(){
    this.allSites = this.PasswordManagerService.loadSites();
  }

  editSite(siteName: string, siteURL: string, siteImgURL: string, id: string){
    this.siteName = siteName;
    this.siteURL = siteURL;
    this.siteImgURL = siteImgURL;
    this.siteId = id;

    this.formState = "Edytuj";
  }

  deleteSite(id: string){
  this.PasswordManagerService.deleteSite(id)
  .then(()=> {
    this.showAlert('Dane usunięte pomyślnie')
  })
  .catch(err => {
    console.log(err);
  })
  }
}
