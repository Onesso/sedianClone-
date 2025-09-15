import { RejectedExceptionsComponent } from "./rejected-exceptions/rejected-exceptions.component";
import { ApprovedExceptionsComponent } from "./approved-exceptions/approved-exceptions.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FailedIprsComponent } from "./failed-iprs/failed-iprs.component";
import { FailedKraComponent } from "./failed-kra/failed-kra.component";
import { IprsLogsComponent } from "./iprs-logs/iprs-logs/iprs-logs.component";
import { KraLogsComponent } from "./kra-logs/kra-logs.component";
import { DocumentsArchivedComponent } from "./documents-archived/documents-archived.component";
import { DropOffComponent } from "./drop-off/drop-off.component";

const routes: Routes = [
  {
    path: "approved-exceptions",
    component: ApprovedExceptionsComponent,
  },
  {
    path: "rejected-exceptions",
    component: RejectedExceptionsComponent,
  },
  {
    path: "kra-logs",
    component: KraLogsComponent,
  },
  {
    path: "iprs-logs",
    component: IprsLogsComponent,
  },
  {
    path: "failed-kra",
    component: FailedKraComponent,
  },
  {
    path: "failed-iprs",
    component: FailedIprsComponent,
  },
  {
    path: "documents-archived",
    component: DocumentsArchivedComponent,
  },
  {
    path: "drop-off",
    component: DropOffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
