import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/Operators";

@Component({
  templateUrl: "./deactivate.component.html",
})
export class DeactivateComponent implements OnInit {

  private item;
  private id;
  private etag;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    const tmp: Observable<HttpResponse<any>> = this.http
                      .get<any>("http://localhost:3000/api/InventoryItem/" + this.id, {observe: "response"});
    this.item = tmp.pipe(map(resp => resp.body));
    tmp.subscribe(resp => this.etag = resp.headers.get("ETag"));
  }

  public deactivateItem() {
    const hdrs = new HttpHeaders({ETag: this.etag});
    this.http
        .delete(`http://localhost:3000/api/InventoryItem/${this.id}`,
              {observe: "response", headers: hdrs})
        .subscribe((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.router.navigateByUrl("/home");
        }});
      }
}
