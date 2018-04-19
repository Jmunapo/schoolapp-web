import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class StorageService {

  constructor(private storage: LocalStorage,
  private cookie: CookieService) { }

  setData(key: string, data: any) {
    return this.storage.setItem(key, data);
  }

  getData(key: string) {
    return this.storage.getItem(key);
  }

  removeData(key: string) {
    return this.storage.removeItem(key);
  }
  clearStorage() {
    return this.storage.clear();
  }
  setCookie(key: string, data: any) {
    data = (typeof data === 'object') ? JSON.stringify(data) : data;
    return this.cookie.set(key, data);
  }

  getCookie(key: string) {
    return JSON.stringify(this.cookie.get(key));
  }

  removeCookie(key: string) {
    return this.cookie.delete(key);
  }

}
