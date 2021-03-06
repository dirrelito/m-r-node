import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/Operators";

type StatusCode = number;
type ETag = string;

@Injectable()
export class ItemService {

  private tagMap: Map<string, ETag> = new Map();

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  public getItem(id: string): Observable<ItemDto> {

    const responseObs: Observable<HttpResponse<ItemDto>> = this.http
                      .get<ItemDto>(`http://localhost:3000/api/InventoryItem/${id}`, {observe: "response"});
    const item = responseObs.pipe(map(resp => resp.body));
    responseObs.subscribe(resp => {
      const tag = resp.headers.get("ETag");
      const version = resp.body.version;
      this.tagMap.set(id + version, tag);
    });
    return item;
  }

  public getAllItems(): Observable<ItemDto[]> {
    return this.http.get<ItemDto[]>("http://localhost:3000/api/InventoryItem");
  }

  public deactivateItem(Id: string, Version: string): Observable<StatusCode> {
    const etag = this.tagMap.get(Id + Version);
    const hdrs = new HttpHeaders({ETag: etag});
    return this.http
        .delete(`http://localhost:3000/api/InventoryItem/${Id}`,
              {observe: "response", headers: hdrs})
        .pipe(map((res: HttpResponse<any>) => res.status));
  }

  public renameItem(name: string, Id: string, Version: number) {
    const etag = this.tagMap.get(Id + Version);
    const hdrs = new HttpHeaders({ETag: etag});
    return this.http
        .patch(`http://localhost:3000/api/InventoryItem/${Id}`,
              {name},
              {observe: "response", headers: hdrs})
        .pipe(map((res: HttpResponse<any>) => res.status));
  }

  public checkIn(count, Id, Version) {
    const etag = this.tagMap.get(Id + Version);
    const hdrs = new HttpHeaders({ETag: etag});
    return this.http
        .post(`http://localhost:3000/api/InventoryItem/${Id}/CheckIn`,
              {count},
              {observe: "response", headers: hdrs})
        .pipe(map((res: HttpResponse<any>) => res.status));
  }

  public remove(count, Id, Version) {
    const etag = this.tagMap.get(Id + Version);
    const hdrs = new HttpHeaders({ETag: etag});
    return this.http
        .post(`http://localhost:3000/api/InventoryItem/${Id}/Remove`,
              {count},
              {observe: "response", headers: hdrs})
        .pipe(map((res: HttpResponse<any>) => res.status));
  }
}

class ItemDto {
  public id: string;
  public version: number;
  public currentCount: number;
  public name: string;
}
