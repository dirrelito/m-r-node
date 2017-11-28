import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "./checkIn.component.html",
})
export class CheckInComponent implements OnInit {

  private expectedVersion: string;
  private id: string;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.http.get<any>("http://localhost:3000/api/InventoryItem/" + this.id).subscribe(
      data => {  this.expectedVersion = data.Version; });
  }

  public checkInItem(count) {
    this.http
        .post(`http://localhost:3000/api/InventoryItem/${this.id}/CheckIn`,
              {count, expectedVersion: this.expectedVersion},
              {observe: "response"})
        .subscribe((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.router.navigateByUrl("/home");
        }});
      }
}
