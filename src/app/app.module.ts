import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './home/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ImageUploadModule } from 'angular2-image-upload';
import { FooterComponent } from './footer/footer.component';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
import {NgxMaskModule} from 'ngx-mask';

import { Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { RemoteService } from './home/common/remote.service';
import { StorageService } from './home/common/storage.service';
import { NewUserComponent } from './home/new-user/new-user.component';
import { AboutComponent } from './home/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    FooterComponent,
    NewUserComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LocalStorageModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ImageUploadModule.forRoot(),
    HttpClientModule
  ],
  providers: [RemoteService,
    StorageService,
    CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
