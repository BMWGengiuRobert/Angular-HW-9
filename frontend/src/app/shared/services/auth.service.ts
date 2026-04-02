import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly httpClient = inject(HttpClient);
    private readonly url: string = `${environment.baseURL}/auth`;

    login(dto: LoginDto): Observable<{ accessToken: string }> {
        return this.httpClient.post<{ accessToken: string }>(`${this.url}/login`, dto);
    }

    register(dto: RegisterDto) {
        return this.httpClient.post(`${this.url}/register`, dto);
    }


}