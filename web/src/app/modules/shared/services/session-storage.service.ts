import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  public set(key: string, value: string) {
    sessionStorage.setItem(key, value)
  }

  public get(key: string) {
    return sessionStorage.getItem(key)
  }

  public remove(key: string) {
    sessionStorage.removeItem(key);
  }

  public clear() {
    sessionStorage.clear();
  }
}
