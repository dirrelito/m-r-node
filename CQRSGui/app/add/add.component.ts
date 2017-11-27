import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import {Router} from "@angular/router";

import { Component } from "@angular/core";

@Component({
  templateUrl: "./add.component.html",
})
export class AddComponent {

  constructor(private http: HttpClient, private router: Router) {}

  public addItem(name) {

    this.http
        .post("http://localhost:3000/api/InventoryItem",
              {name},
              {observe: "response", responseType: "text" })
        .subscribe((res: HttpResponse<any>) => {
          if (res.status === 202) {
            console.log(res.headers.get("Location"));
            this.router.navigateByUrl("/home");
        }});
}

}
