import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AddComponent } from "./add/add.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CheckInComponent } from "./checkIn/checkIn.component";
import { DeactivateComponent } from "./deactivate/deactivate.component";
import { DetailsComponent } from "./details/details.component";
import { HomeComponent } from "./home/home.component";
import { ItemService } from "./item.service";
import { RemoveComponent } from "./remove/remove.component";
import { RenameComponent } from "./rename/rename.component";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AddComponent,
    AppComponent,
    HomeComponent,
    DetailsComponent,
    RenameComponent,
    DeactivateComponent,
    CheckInComponent,
    RemoveComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ItemService],
})
export class AppModule { }
