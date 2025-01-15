import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import {
  IdverseSdkUiCustomEvent,
  SdkError,
  FaceScanRecognizerResult,
} from "@idverse/idverse-sdk-browser/ui";
import { SdkType } from "@idverse/idverse-sdk-browser";

import "@idverse/idverse-sdk-browser/ui";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule],
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
  resultData: FaceScanRecognizerResult | null = null;

  private onSdkReady = () => {
    console.log("Successfully loaded");
  };

  private onScanSuccess = (ev: IdverseSdkUiCustomEvent<any>) => {
    console.log(ev.detail);
    const res = ev as unknown as IdverseSdkUiCustomEvent<any>;
    this.resultData = res.detail.result.status;
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

  public onTryAgain = () => {
    this.resultData = null;
  };

  ngOnInit() {
    this.idverseSdk = document.querySelector(
      "idverse-sdk-ui"
    ) as HTMLIdverseSdkUiElement;
    if (!this.idverseSdk) {
      throw "idverse-sdk-ui tag does not exist";
    }
    this.idverseSdk.recognizers = [SdkType.FaceScan];

    this.idverseSdk.addEventListener("ready", this.onSdkReady);
    this.idverseSdk.addEventListener("fatalError", this.onError);
    this.idverseSdk.addEventListener("scanFail", this.onScanFail);
    this.idverseSdk.addEventListener("scanSuccess", this.onScanSuccess);
    this.idverseSdk.addEventListener("authenticated", this.onAuthenticated);
  }

  onhandleStart() {
    if (this.idverseSdk && this.ready) this.idverseSdk.startFaceScan();
  }
  onClearError() {
    this.errorText = null;
  }
}
