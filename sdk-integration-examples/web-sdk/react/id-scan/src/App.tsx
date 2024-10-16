import { useEffect, useState } from "react";
import idverselogo from "/logo.svg";
import loadingSvg from "./assets/loading.svg";
import "./App.css";

import "@idverse/idverse-sdk-browser/ui";
import {
  IDScanProcessStatus,
  IDScanRecognizerResult,
  IdverseSdkUiCustomEvent,
  SdkError,
} from "@idverse/idverse-sdk-browser/ui";
import { Details } from "./components/Details/Details";

function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [scanBothSides, setScanBothSides] = useState(false);
  const [resultData, setResultData] = useState<IDScanRecognizerResult>();
  const [idverseSDK, setIdverseSDK] = useState<HTMLIdverseSdkUiElement | null>(
    null
  );

  const onSdkReady = () => {
    setLoading(false);
    setReady(true);
    console.log("Successfully loaded");
  };

  const onScanSuccess = (
    ev: IdverseSdkUiCustomEvent<IDScanRecognizerResult>
  ) => {
    console.log(ev.detail);
  };

  const onScanFail = (ev: IdverseSdkUiCustomEvent<IDScanProcessStatus>) => {
    console.log("failed to scan.", ev);
    setError(ev.detail.toString());
  };

  const onError = (e: IdverseSdkUiCustomEvent<SdkError>) => {
    setLoading(false);
    console.error("SDKError", e.detail);
    setError(e.detail.message.toString());
  };

  useEffect(() => {
    const sdk = document.querySelector(
      "idverse-sdk-ui"
    ) as HTMLIdverseSdkUiElement;
    if (!sdk) {
      throw "idverse-sdk-ui tag does not exist";
    }

    sdk.addEventListener("ready", onSdkReady);
    sdk.addEventListener("fatalError", onError);
    sdk.addEventListener("scanFail", onScanFail);
    sdk.addEventListener("scanSuccess", onScanSuccess);

    setIdverseSDK(sdk);
  }, []);

  const handleStart = async (state: boolean) => {
    if (!idverseSDK || !ready) return;
    setScanBothSides(state);
    try {
      idverseSDK.startScanning();
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
      <h1>Simple ID Scan with Vite + React</h1>
      {loading ? (
        <div className="card">
          <img src={loadingSvg} alt="Loading icon" />
        </div>
      ) : (
        <div className="card">
          <button onClick={() => handleStart(false)}>
            Start ID Front Side
          </button>
          <button onClick={() => handleStart(true)}>
            Start ID Check Both Sides
          </button>
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
      {resultData && (
        <Details
          details={resultData}
          onClose={() => {
            setResultData(undefined);
          }}
          onTryAgain={() => {
            setResultData(undefined);
            handleStart(scanBothSides);
          }}
        />
      )}

      <idverse-sdk-ui
        sessionURL="http://localhost:3000"
        sessionToken="a0dab893-c77d-54f7-96c1-f31ebbdaba4a"
        type="ID_SCAN"
        scanBothSides={scanBothSides}
      ></idverse-sdk-ui>

      <p className="read-the-docs">Click on the IDVerse logo to learn more</p>
    </>
  );
}

export default App;
