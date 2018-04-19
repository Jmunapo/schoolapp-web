import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormControl, Validators, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { School, Adminstrator, User } from '../common/model.model';
import { RemoteService } from '../common/remote.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../common/storage.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() registrationComplete = new EventEmitter<string>();
  school = new School();
  admin = new Adminstrator();
  user = new User();
  terms = false;
  xulForm: any;
  media_nonce: string;
  loaderContent: any;
  recaptChaSolved = false;
  constructor(private remote: RemoteService,
    public formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    public toster: ToastrService,
    private storage: StorageService,
    private modal: NgbModal) { }

  sendMessage() {
    this.registrationComplete.emit();
  }

  resolved(e) {
    console.log(e);
    this.recaptChaSolved = true;
  }


  ngOnInit() {
    this.storage.getData('user')
      .subscribe(data => {
        this.user = data;
        if (data) {
          setTimeout(() => this.toster.info(`You already registered a school please use login,
        or contact your webmaster`));
        }
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  openSm(content) {
    this.loaderContent = this.modal.open(content, { size: 'sm', centered: true, backdrop: 'static' });
  }

  onSubmit(schoolForm: NgForm): void {
    if (!schoolForm.valid ||
      !this.terms ||
      this.school.password !== this.school.cpassword ||
      !this.recaptChaSolved) {
      this.toster.error(`Gotchaa...!!! -> Follow the rules`);
      if (this.loaderContent) {
        this.loaderContent.close();
      }
      return;
    }
    this.xulForm = schoolForm;
    this.adminAccount(schoolForm.value);
  }

  adminAccount(data: School) {
    const adminSubs = this.remote.get_nonce('usernonce')
      .subscribe(val => {
        const nonce = val['nonce'];
        const adminData: Adminstrator = {
          username: data.subdomain,
          email: data.email,
          nonce: nonce,
          display_name: 'adminstrator',
          first_name: data.name,
          user_pass: data.password
        };
        const createData = this.serialize_get(adminData);
        adminSubs.unsubscribe();
        const adminSub2 = this.remote.registerAdministrator(createData)
          .subscribe(res => {
            this.user = {
              cookie: res['cookie'],
              id: res['user_id'],
              username: ''
            };
            this.setUser();
            this.createSchoolPost(data);
            adminSub2.unsubscribe();
          },
            error => {
              console.log(error);
              if (error.error) {
                let errTxt = 'Subdomain already exists';
                if (error.error.error === 'E-mail address is already in use.' ||
                  error.error.error === 'E-mail address is invalid.') {
                  errTxt = error.error.error;
                  this.showOneError('email');
                } else {
                  this.showOneError('subdomain');
                }
                this.toster.error(`Error: ${errTxt}`, 'Admin account Register Failed');
              } else {
                this.toster.error('Something went wrong, please submit a ticket to your webmaster',
                  'School Register Failed');
                this.loaderContent.close();
              }
            });
      }, error => {
        console.log(error);
        adminSubs.unsubscribe();
        this.loaderContent.close();
        this.toster.error('Something went wrong, please check your connection', 'School Register Failed');
      });
  }
  createSchoolPost(data: School) {
    const nonceSub = this.remote.get_nonce('postnonce')
      .subscribe(val => {
        const nonce = val['nonce'];
        const postObj = {
          cookie: this.user.cookie,
          nonce: nonce,
          insecure: 'cool',
          seconds: '40000',
          type: 'school',
          title: data.name,
          slug: this.createSlug(data.name),
        };
        const postSer = this.serialize_get(postObj);
        nonceSub.unsubscribe();
        const postSubs = this.remote.createPost(postSer)
          .subscribe(res => {
            console.log(res);
            this.addSchoolMeta(data, res);
            postSubs.unsubscribe();
          }, err => {
            this.loaderContent.close();
            console.log(err);
            postSubs.unsubscribe();
            this.toster.error('Something went wrong, check your connection or contact your webmaster',
              'School Register Failed');
          });
      }, error => {
        this.toster.error('Something went wrong, check your connection or contact your webmaster',
          'School Register Failed');
        this.loaderContent.close();
        console.log(error);
        nonceSub.unsubscribe();
      });
  }

  addSchoolMeta(data: School, post: any) {
    const postId = post.post.id;
    const metaObj = {
      b: data.name,
      c: data.subdomain,
      d: data.motto,
      e: data.address,
      f: data.location,
      g: data.city,
      h: data.email,
      i: data.cell,
      j: data.tell
    };
    this.storage.setCookie('postId', postId);
    const metSer = this.serialize_get(metaObj);
    const addMetaSub = this.remote.addSchoolMeta(metSer, postId)
    .subscribe(res => {
        this.regCompleted();
        console.log(res);
        this.user.username = data.subdomain;
        this.setUser();
        addMetaSub.unsubscribe();
      }, err => {
        this.loaderContent.close();
        console.log(err);
        addMetaSub.unsubscribe();
        this.toster.error('Something went wrong but you account have been created please contact your webmaster',
          'School Register Failed');
      });
  }

  serialize_get(obj) {
    obj.insecure = 'cool';
    const str = [];
    for (const e in obj) {
      if (obj.hasOwnProperty(e)) {
        str.push(encodeURIComponent(e) + '=' + encodeURIComponent(obj[e]));
      }
    }
    return str.join('&');
  }
  createSlug(strng: string) {
    return strng.split(' ').join('_');
  }

  showOneError(on: string) {
    this.loaderContent.close();
    this.xulForm.form.controls[on].status = 'INVALID';
    document.getElementById(on).focus();
  }
  regCompleted() {
    this.loaderContent.close();
    this.xulForm.reset();
    this.toster.success('School registered successfully, open your email for the next step',
      'School Register');
    this.sendMessage();
  }

  validate_subdomain(subdomain: string) {
    subdomain += '.diamond.school';
    const regExp = /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i;
    if (regExp.test(subdomain)) {
      return true;
    }
    return false;
  }

  sanitiseDomain(e) {
    const inputValue = (<HTMLInputElement>document.getElementById('subdomain')).value;
    const domain = this.validate_subdomain(inputValue);
    if (!domain && e.key !== 'Backspace') {
      (<HTMLInputElement>document.getElementById('subdomain')).value = inputValue.substring(0, inputValue.length - 1);
      this.toster.error(`${e.key} not allowed on domain name`);
    }
  }

  setUser() {
    this.storage.setData('user', this.user)
    .subscribe(sav => {
      console.log(this.user);
      console.log(sav);
    }, err => {
      console.log(err);
    });
  }
}
