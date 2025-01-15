import { useEffect, useState } from "react";
import idverselogo from "/logo.svg";
import loadingSvg from "./assets/loading.svg";
import "./App.css";

import "@idverse/idverse-sdk-browser/ui";
import {
  IDScanRecognizerResult,
  IdverseSdkUiCustomEvent,
} from "@idverse/idverse-sdk-browser/ui";
import { SdkType } from "@idverse/idverse-sdk-browser";

function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [resultData, setResultData] = useState<IDScanRecognizerResult>();
  const [idverseSDK, setIdverseSDK] = useState<HTMLIdverseSdkUiElement | null>(
    null
  );

  const onSdkReady = () => {
    setLoading(false);
    setReady(true);
    console.log("Successfully loaded");
  };

  const onScanSuccess = (ev: IdverseSdkUiCustomEvent<any>) => {
    console.log(ev.detail);
    setResultData(ev.detail.result.status);
  };

  const onScanFail = (ev: IdverseSdkUiCustomEvent<any>) => {
    console.log("failed to scan.", ev);
    setError(ev.detail.toString());
  };

  const onError = (e: IdverseSdkUiCustomEvent<any>) => {
    setLoading(false);
    console.error("SDKError", e.detail);
    setError(e.detail.message.toString());
  };

  const onFirstScan = (e: IdverseSdkUiCustomEvent<any>) => {
    console.log("first scan", e);
  };

  const onAuthenticationSuccess = (e: IdverseSdkUiCustomEvent<any>) => {
    console.log("authentication success", e);
    setLoading(false);
    setReady(true);
  };

  const closeSession = () => {
    idverseSDK?.close();
    setResultData(undefined);
  };

  useEffect(() => {
    const sdk = document.querySelector(
      "idverse-sdk-ui"
    ) as HTMLIdverseSdkUiElement;
    if (!sdk) {
      throw "idverse-sdk-ui tag does not exist";
    }
    sdk.recognizers = [SdkType.FaceScan];

    sdk.addEventListener("ready", onSdkReady);
    sdk.addEventListener("fatalError", onError);
    sdk.addEventListener("scanFail", onScanFail);
    sdk.addEventListener("scanSuccess", onScanSuccess);
    sdk.addEventListener("firstScan", onFirstScan);
    sdk.addEventListener("authenticated", onAuthenticationSuccess);

    setIdverseSDK(sdk);
  }, []);

  const handleStart = async () => {
    if (!idverseSDK || !ready) return;
    try {
      idverseSDK.startFaceScan();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div>
        <a href="https://idverse.com" target="_blank">
          <img src={idverselogo} className="logo" alt="IDVerse logo" />
        </a>
      </div>
      <h1>Face Scan with Vite + React</h1>
      {loading ? (
        <div className="card">
          <img id="loading-icon" src={loadingSvg} alt="Loading icon" />
        </div>
      ) : (
        <div className="card">
          <button onClick={() => handleStart()}>Start Face Scan</button>
        </div>
      )}
      {resultData === 1 && (
        <div className="card">
          <button onClick={() => closeSession()}>Close</button>
        </div>
      )}
      {error && (
        <idv-modal warning visible heading="An error occurred.">
          <p>{error}</p>
          <div>
            <idv-button
              onClick={() => setError(undefined)}
              label="Close"
              variant="primary outline"
            ></idv-button>
          </div>
        </idv-modal>
      )}

      <idverse-sdk-ui
        session-url="YOUR_SESSION_URL"
        session-token="YOUR_SESSION_TOKEN"
        session-build-id="YOUR_SESSION_BUILD_ID"
      ></idverse-sdk-ui>

      <p className="read-the-docs">Click on the IDVerse logo to learn more</p>
    </>
  );
}

export default App;
