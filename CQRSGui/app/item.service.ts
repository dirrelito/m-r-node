import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ItemService {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  public getItem(id: string): Observable<ItemDto> {
    const i: Observable<ItemDto> = this.http.get<ItemDto>("http://localhost:3000/api/InventoryItem/" + id);
    return i;
  }
}

class ItemDto {
  public Id: string;
  public Version: number;
  public CurrentCount: number;
  public Name: string;
}
