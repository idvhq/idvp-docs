import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import {
  IDScanRecognizerResult,
  IdverseSdkUiCustomEvent,
  SdkError,
} from "@idverse/idverse-sdk-browser/ui";
import "@idverse/idverse-sdk-browser/ui";
import { SdkType } from "@idverse/idverse-sdk-browser";

import { DetailsComponent } from "./details/details.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, DetailsComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = "angluar-id-scan";
  private idverseSdk: HTMLIdverseSdkUiElement | null = null;
  loading: boolean = true;
  ready: boolean = false;
  errorText: string | null = null;
  scanBothSides: boolean = false;
  resultData: IDScanRecognizerResult | null = null;

  private onSdkReady = () => {
    console.log("Successfully loaded");
  };

  private onScanSuccess = (ev: IdverseSdkUiCustomEvent<any>) => {
    console.log(ev.detail);
    this.resultData = ev.detail.result.details.extractedInfo.viz;
  };

  private onScanFail = (ev: IdverseSdkUiCustomEvent<any>) => {
    console.log("failed to scan.", ev);
    this.errorText = ev.detail.toString();
  };

  private onError = (e: IdverseSdkUiCustomEvent<SdkError>) => {
    this.loading = false;
    console.error("SDKError", e.detail);
    this.errorText = e.detail.message.toString();
  };

  private onAuthenticated = (ev: IdverseSdkUiCustomEvent<any>) => {
    console.log("authenticated", ev);
    this.loading = false;
    this.ready = true;
  };

  private closeSession = () => {
    this.idverseSdk?.close();
  };

  public onClose = () => {
    this.resultData = null;
    this.closeSession();
  };

  ngOnInit() {
    this.idverseSdk = document.querySelector(
      "idverse-sdk-ui"
    ) as HTMLIdverseSdkUiElement;
    if (!this.idverseSdk) {
      throw "idverse-sdk-ui tag does not exist";
    }
    this.idverseSdk.recognizers = [SdkType.IDScan];
    this.idverseSdk.enableDFA = true;
    this.idverseSdk.enableFaceMatch = true;

    this.idverseSdk.addEventListener("ready", this.onSdkReady);
    this.idverseSdk.addEventListener("fatalError", this.onError);
    this.idverseSdk.addEventListener("scanFail", this.onScanFail);
    this.idverseSdk.addEventListener("scanSuccess", this.onScanSuccess);
    this.idverseSdk.addEventListener("authenticated", this.onAuthenticated);
  }

  onhandleStart(state: boolean) {
    this.scanBothSides = state;

    if (this.idverseSdk && this.ready) {
      this.idverseSdk.setScanBothSides(state);
      this.idverseSdk.startIDScan();
    }
  }
  onClearError() {
    this.errorText = null;
  }
}
