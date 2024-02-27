import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "../models/login.interface";
import { Observable, BehaviorSubject } from "rxjs";
import { environment as env } from "src/environments/environment";
import { endpoint, httpOptions } from "@shared/apis/endpoint";
import { map } from "rxjs/operators";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { NavigationService } from "src/@vex/services/navigation.service";
import { IconsService } from "@shared/services/icons.service";




@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user: BehaviorSubject<BaseResponse>;
  
  private isAdmin = false;

  public get userToken(): BaseResponse {
    return this.user.value;
  }

  public get userAdmin() {
    return this.isAdmin;
  }

  constructor(private http: HttpClient, private navigationService: NavigationService) {
    this.user = new BehaviorSubject<BaseResponse>(
      JSON.parse(localStorage.getItem("token"))
    );

    
      this.navigationService.items = [
        {
          type: "link",
          label: "InicioPrueba",
          route: "home",
          icon: IconsService.prototype.getIcon("icHome"),
        },
        {
          type: "link",
          label: "Tienda",
          route: "tienda",
          icon: IconsService.prototype.getIcon("icShop"),
        },          
      ]  

      if (localStorage.getItem("token"))
      this.userMenuItems(); 

  }

  login(req: Login, authType: string): Observable<BaseResponse> {
    localStorage.setItem("authType", "Interno");
    //const requestUrl = `${env.api}${endpoint.LOGIN}?authType=${authType}`;    
    const requestUrl = `/api/Auth/Login?authType=Interno`;    
    return this.http.post<BaseResponse>(requestUrl, req, httpOptions).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          localStorage.setItem("token", JSON.stringify(resp.data));          
          this.user.next(resp.data);
          this.userMenuItems();
        }
        return resp;
      })
    );
  }

  loginWithGoogle(
    credential: string,
    authType: string
  ): Observable<BaseResponse> {
    localStorage.setItem("authType", "Externo");
    //const requestUrl = `${env.api}${endpoint.LOGIN_GOOGLE}?authType=${authType}`;
    //const requestUrl = `${endpoint.LOGIN_GOOGLE}?authType=${authType}`;
    const requestUrl = `/api/${env.api}${endpoint.LOGIN_GOOGLE}?authType=${authType}`;    
    return this.http
      .post<BaseResponse>(requestUrl, JSON.stringify(credential), httpOptions)
      .pipe(
        map((resp: BaseResponse) => {
          if (resp.isSuccess) {
            localStorage.setItem("token", JSON.stringify(resp.data));            
            this.user.next(resp.data);
            this.userMenuItems();
          }

          return resp;
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authType");
    this.user.next(null);
    this.navigationService.items = [];
    window.location.reload();    
  }

  userIsAdmin(){        
    if (this.userToken)
    {
      let [header, payload, signature] = (this.userToken).toString().split('.');    
      let decodedPayload = atob(payload);    
      let payloadObj = JSON.parse(decodedPayload);

      let user = payloadObj.nameid;      
  
      this.isAdmin = (user === 'admin@gmail.com') ? true: false;                
    }        
  }


  userMenuItems(){
    this.userIsAdmin();
    if (this.isAdmin)
    {
      
      this.navigationService.items = [...this.navigationService.items,
        {
          type: "link",
          label: "Estadísticas",
          route: "estadisticas",
          icon: IconsService.prototype.getIcon("icDashboard"),
        },
        {
          type: "link",
          label: "Almacenes",
          route: "almacenes",
          icon: IconsService.prototype.getIcon("icWarehouse"),
        },
        {
          type: "dropdown",
          label: "Catálogo",
          icon: IconsService.prototype.getIcon("icManage"),
          children: [
            {
              type: "link",
              label: "Categorias",
              route: "categorias",
            },
            {
              type: "link",
              label: "Productos",
              route: "productos",
            },
          ],
        },
        {
          type: "link",
          label: "Proveedores",
          route: "proveedores",
          icon: IconsService.prototype.getIcon("icProvider"),
        },
        {
          type: "dropdown",
          label: "Procesos",
          icon: IconsService.prototype.getIcon("icSales"),
          children: [
            {
              type: "link",
              label: "Proceso de Compras",
              route: "proceso-compras",
            },
            {
              type: "link",
              label: "Proceso de Ventas",
              route: "proceso-ventas",
            },
          ],
        },        
      ]         
    } 
  }
}
