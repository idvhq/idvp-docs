const sessionUrl = import.meta.env.VITE_SDK_SESSION_URL;
const sessionToken = import.meta.env.VITE_SDK_SESSION_TOKEN;

import { useEffect, useState } from "react";
import idverselogo from "/logo.svg";
import loadingSvg from "./assets/loading.svg";
import "./App.css";

import { IdvSdkWebCustomEvent, SdkType } from "@idverse/idv-sdk-web";

import { Details } from "./components/Details/Details";

function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [_scanBothSides, setScanBothSides] = useState(false);
  const [resultData, setResultData] = useState<any>();
  const [idverseSDK, setIdverseSDK] = useState<HTMLIdvSdkWebElement | null>(
    null,
  );

  const onSdkReady = () => {
    setLoading(false);
    setReady(true);
    console.log("Successfully loaded");
  };

  const onScanSuccess = (ev: IdvSdkWebCustomEvent<any>) => {
    // When ID Scan, the extracted details are found here
    const res = ev.detail.result?.details?.extractedInfo?.viz?.primary;
    setResultData(
      Object.entries(res).map(([key, value]) => ({
        fieldName: key,
        fieldValue: value,
      })),
    );
  };

  const onScanFail = (ev: IdvSdkWebCustomEvent<any>) => {
    console.log("failed to scan.", ev);
    setError(ev.detail.toString());
  };

  const onError = (e: IdvSdkWebCustomEvent<any>) => {
    setLoading(false);
    console.error("SDKError", e.detail);
    setError(e.detail.message.toString());
  };

  const onFirstScan = (e: IdvSdkWebCustomEvent<any>) => {
    console.log("first scan", e);
  };

  const onAuthenticationSuccess = (e: IdvSdkWebCustomEvent<any>) => {
    console.log("authentication success", e);
    setLoading(false);
    setReady(true);
  };

  const closeSession = () => {
    idverseSDK?.close();
  };

  useEffect(() => {
    const sdk = document.querySelector("idv-sdk-web") as HTMLIdvSdkWebElement;
    if (!sdk) {
      throw "idv-sdk-web tag does not exist";
    }
    sdk.recognizers = [SdkType.IDScan];
    sdk.enableDFA = true;
    // INFO: Set to true when IDScan is used in combination with FaceScan, and a Face Match result is required.
    sdk.enableFaceMatch = false;

    sdk.addEventListener("ready", onSdkReady);
    sdk.addEventListener("fatalError", onError);
    sdk.addEventListener("scanFail", onScanFail);
    sdk.addEventListener("scanSuccess", onScanSuccess);
    sdk.addEventListener("firstScan", onFirstScan);
    sdk.addEventListener("authenticated", onAuthenticationSuccess);

    setIdverseSDK(sdk);
  }, []);

  const handleStart = async (state: boolean) => {
    if (!idverseSDK || !ready) return;
    setScanBothSides(state);
    idverseSDK.setScanBothSides(state);
    setLoading(true);
    try {
      idverseSDK.startIDScan();
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
            closeSession();
          }}
        />
      )}

      {/* Initialize endpoint is called as soon as <idv-sdk-web/> is in the DOM */}
      <idv-sdk-web
        session-url={sessionUrl}
        session-token={sessionToken}
        // Use `enable-dfa` prop to choose whether or not DFA engine is enabled, if value is static and will not change
        // If for some reason value is dynamic (needs to change) use `sdk.setEnableDFA()`
        enable-dfa={true}
        // Use `enable-face-match` prop to choose whether or not FaceMatch engine is enabled, if value is static and will not change
        // If for some reason value is dynamic (needs to change) use `sdk.setEnableFaceMatch()`
        enable-face-match={true}
        skip-face-scan-intro={true}
        // worker-path="./sdk-idverse/assets/IDVerseSDK.worker.min.XXXXX.js"
      />

      <p className="read-the-docs">Click on the IDVerse logo to learn more</p>
    </>
  );
}

export default App;
