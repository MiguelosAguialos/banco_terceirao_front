import { Injectable } from '@angular/core';
import { LocalUser } from '../app/model/local_user';
import { STORAGE_KEYS } from 'src/config/storage_keys.config';

@Injectable()
export class StorageService {
  getLocalUser() {
    let usr = localStorage.getItem(STORAGE_KEYS.localUser);
    if (usr == null) {
      return null;
    } else {
      return JSON.parse(usr);
    }
  }
  setLocalUser(obj: LocalUser) {
    if (obj == null) {
      localStorage.removeItem(STORAGE_KEYS.localUser);
    } else {
      localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
    }
  }

  clearLocalUser() {
    localStorage.removeItem(STORAGE_KEYS.localUser);
  }
  // public saveToken(token: string): void {
  //     window.sessionStorage.removeItem(TOKEN_KEY)
  //     window.sessionStorage.setItem(TOKEN_KEY, token)
  // }
  // public getToken(): any {
  //     return sessionStorage.getItem(TOKEN_KEY)
  // }
}
