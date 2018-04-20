import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RemoteService } from '../common/remote.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {
  format: string;
  platformSelected = false;
  req = 'Android';
  platform = '';
  email: string;
  schoolname: string;
  constructor(public toster: ToastrService, private remote: RemoteService) { }

  ngOnInit() {
  }

  platformChange(e) {
    const val = e.target.value;
    if (val !== 'Select Platform') {
      this.platform = val;
      this.platformSelected = true;
      this.format = (val === 'ANDROID') ? 'APK v1.0' : 'IPA v1.0';
    } else {
      this.platformSelected = false;
    }
  }

  reqChange(e) {
    const val = e.target.value;
    this.req = val;
  }

  toDownload() {
    if (this.email && this.platformSelected) {
     if (this.platform === 'ANDROID') {
       this.toPlaystore();
     } else {
       this.toAppstore();
     }
    }
  }

  toPlaystore() {
    if (this.validate_email()) {
      this.saveData();
      this.toster.info(`Thanks for downloading diamond messenger`);
      console.log('To Playstore');
      setTimeout(() => {
        window.location.href = 'http://play.google.com/store/apps/details?id=com.truecaller&hl=en';
      }, 1000);
    } else {
      this.toster.warning(`Invalid Email`);
    }
  }
  toAppstore() {
    if (this.validate_email()) {
      this.toster.info(`Thanks for downloading diamond messenger`);
      console.log('To AppStore');
      this.saveData();
      setTimeout(() => {
        window.location.href = 'http://itunes.apple.com/lb/app/truecaller-caller-id-number/id448142450?mt=8';
      }, 1000);
    } else {
      this.toster.warning(`Invalid Email`);
    }
  }

  saveData() {
    const name = this.email.split('@')[0];
    const data = `email=${this.email}&name=${name}&profile=${this.schoolname}`;
    this.remote.downloadSubscription(data).subscribe(res => {
      console.log(res);
    }, error => console.log(error));
  }

  validate_email() {
  const regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return regExp.test(this.email);
  }
}
