import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl: string;
  private defaultHeaders: { [key: string]: string } = {};

  constructor(private readonly http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  private getDefaultHeaders() {
    return this.defaultHeaders;
  }

  public setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  public removeHeader(key: string) {
    delete this.defaultHeaders[key]
  }

  private get defaultOptions() {
    return {
      headers: this.defaultHeaders
    }
  }

  private getOptions(options: HttpOptions = {}): HttpOptions {
    return {
      ...this.defaultOptions,
      ...options
    }
  }

  public async get<T>(path: string, options?: HttpOptions): Promise<T> {
    const response = await firstValueFrom(this.http.get<T>(`${this.apiUrl}${path}`, this.getOptions(options) as any)); //Pass data optionally

    return response as any;
  }

  public async post<T, Payload = any>(path: string, payload: Payload, options?: HttpOptions): Promise<T> {
    const response = await firstValueFrom(this.http.post<T>(`${this.apiUrl}${path}`, payload, this.getOptions(options) as any));

    return response as any;
  }

  public async delete<T, Payload = any>(path: string, payload?: Payload, options: HttpOptions = {}) {
    const httpOptions = this.getOptions({
      ...options,
      body: payload
    })
    const response = await firstValueFrom(this.http.delete<T>(`${this.apiUrl}${path}`, httpOptions as any));

    return response;
  }

  public async patch<T, Payload = any>(path: string, payload: Payload) {
    const httpOptions = this.getOptions();

    const response = await firstValueFrom(this.http.patch<T>(`${this.apiUrl}${path}`, payload, httpOptions as any));

    return response as any;
  }

  public async put<T, Payload = any>(path: string, payload: Payload) {
    const httpOptions = this.getOptions();
    const response = await firstValueFrom(this.http.put<T>(`${this.apiUrl}${path}`, payload, httpOptions as any));

    return response;
  }
}

export type HttpOptions = {
  headers?: HttpHeaders | {
      [header: string]: string | string[];
  };
  body?: any;
  context?: HttpContext;
  observe?: string;
  params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: string;
  withCredentials?: boolean;
}
