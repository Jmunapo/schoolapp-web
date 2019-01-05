import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RemoteService {
  private token = '';
  private postnonce = 'http://info.schoolapp.co.zw/info/get_nonce/?controller=posts&method=create_post';
  private usernonce = 'http://info.schoolapp.co.zw/info/get_nonce/?controller=user&method=register';
  headers = new HttpHeaders();
  constructor(
    private http: HttpClient) { }

  // User Login
  auth(login: any) {
    const url = `http://${login.username}.schoolapp.co.zw/wp-json/jwt-auth/v1/token`;
    return this.http.post(url, login);
  }

  get_nonce(type) {
    return this.http.get(this[type]);
  }
  getLogo() {
    const url = 'http://info.schoolapp.co.zw/wp-json/wp/v2/schools/201';
    return this.http.get(url);
  }

  postLogo(data: string, serData: string) {
    const url = `https://info.schoolapp.co.zw/wp-json/infoplugin/v1/addmeta/?${serData}`;
    this.headers = this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(url, data, { headers: this.headers });
  }

  register_(data) {
    const url = `http://info.schoolapp.co.zw/info/user/create_post?${data}`;
    return this.http.get(url);
  }


  registerAdministrator(data: string) {
    const url = `http://info.schoolapp.co.zw/info/user/register?${data}`;
    return this.http.get(url);
  }

  addSchoolMeta(metaSerialized: string, postId: number) {
    const url = `http://info.schoolapp.co.zw/wp-json/infoplugin/v1/schoolreg/${postId}/?${metaSerialized}`;
    return this.http.get(url);
  }

  createPost(postSerilized: string) {
   const url = `https://info.schoolapp.co.zw/info/posts/create_post/?${postSerilized}`;
    return this.http.get(url);
  }

  do_login(data: string) {
    const url = `http://info.schoolapp.co.zw/info/auth/generate_auth_cookie/?${data}`;
    return this.http.get(url);
  }
  getUser() {
    const url = 'http://info.schoolapp.co.zw/info/auth/get_currentuserinfo/?insecure=cool&cookie=';
    return this.http.get(url);
  }

  getSchool(id) {
    const url = `http://info.schoolapp.co.zw/wp-json/wp/v2/schools/154`;
    return this.http.get(url);
  }

  mySchool(subdomain: string) {
    const url = `http://info.schoolapp.co.zw/wp-json/wp/v2/schools?search=${subdomain}`;
    return this.http.get(url);
  }

  // createMessage(subdomain: string, token: string) {
  //   this.headers = this.headers.append('Content-Type', 'application/json');
  //   this.headers = this.headers.append('Authorization', `Bearer ${token}`);
  //   const url = `http://${subdomain}.schoolapp.co.zw/wp-json/wp/v2/groupa`;
  //   console.log(this.headers);
  //   return this.http.post(url, {
  //     title: 'My newest event!!!',
  //     status: 'publish',
  //     location: 'Mutare'
  //   }, { headers: this.headers});
  // }

  getEvents() {
    const url = `http://basic.schoolapp.co.zw/wp-json/wp/v2/events`;
    return this.http.get(url);
  }

  downloadSubscription(data: any) {
    console.log(data);
    this.headers = this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const url = `https://info.schoolapp.co.zw/wp-json/newsletter/v1/subscribe`;
    console.log(url, data, { headers: this.headers });
    return this.http.post(url, data, { headers: this.headers });
  }
}
