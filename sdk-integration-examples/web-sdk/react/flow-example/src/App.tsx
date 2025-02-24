import { useState, useEffect } from "react";
import "./App.css";
import { IdverseSdkUiCustomEvent } from "@idverse/idverse-sdk-browser/ui";
import { SdkType } from "@idverse/idverse-sdk-browser";

import { Details } from "./components/Details/Details";

const STORAGE_KEY = "session_api_url";
const BUILD_KEY = "session_build_id";

function App() {
  const [loading, setLoading] = useState(false);
  const [sessionUrl, setSessionUrl] = useState<string>("");
  const [error, setError] = useState<string>();
  const [resultData, setResultData] = useState<any>();
  const [idverseSDK, setIdverseSDK] = useState<HTMLIdverseSdkUiElement | null>(null);
  const [sessionToken, setSessiontoken] = useState<string>("");
  const [buildId, setBuildId] = useState<string>("");
  const [init, setInit] = useState(false);
  const [enableDFA, setEnableDFA] = useState(true);
  const [enableFaceMatch, setEnableFaceMatch] = useState(true);

  useEffect(() => {
    const keyValue = localStorage.getItem(STORAGE_KEY);
    const buildId = localStorage.getItem(BUILD_KEY);
    if (keyValue) {
      setSessionUrl(keyValue);
    }
    if (buildId) {
      setBuildId(buildId);
    }
  }, []);

  function reset() {
    setSessiontoken(undefined);
    setBuildId(undefined);
    setError(undefined);
    setInit(false);
    setIdverseSDK(null);
    setLoading(false);
    const token = document.getElementById("token") as HTMLInputElement;
    if (token) {
      token.value = "";
    }
    const buildId = document.getElementById("buildId") as HTMLInputElement;
    if (buildId) {
      buildId.value = "";
    }
  }

  /**
   * Handler for when the SDK is ready to start scanning
   * @param e Event containing SDK details
   */
  function onReady(e: IdverseSdkUiCustomEvent<any>) {
    console.log("Ready:", e, "sdk:", e.detail);
    setLoading(false);
  }

  /**
   * Handler for successful ID/face scans
   * Logs success and removes loading state
   * @param e Event containing scan results
   */
  function onScanSuccess(e: IdverseSdkUiCustomEvent<any>) {
    console.log("Scan Success", e);
    const res = e.detail.result?.details?.extractedInfo?.viz;
    if (res) {
      setResultData(res);
    }
    setLoading(false);
  }

  /**
   * Handler for failed scans
   * Logs failure and resets the component state
   * @param e Event containing failure details
   */
  function onScanFail(e: IdverseSdkUiCustomEvent<any>) {
    console.log("scan fail", e);
  }

  function onDone(e: IdverseSdkUiCustomEvent<any>) {
    console.log("done", e);
  }

  function onPayload(e: IdverseSdkUiCustomEvent<any>) {
    console.log("payload", e);
  }

  /**
   * Handler for when user clicks try again after failure
   * Logs event and resets component state
   * @param e Event details
   */
  function onTryAgain(e: IdverseSdkUiCustomEvent<any>) {
    console.log("try again", e);
  }

  /**
   * Handler for SDK errors
   * Logs error and updates error state with message
   * @param e Event containing error details
   */
  function onError(e: IdverseSdkUiCustomEvent<any>) {
    console.log("error", e);
    const message = e.detail.message;
    alert(message);
    setError(message);
  }

  useEffect(() => {
    if (sessionToken) {
      const sdk = document.querySelector(
        "idverse-sdk-ui"
      ) as HTMLIdverseSdkUiElement;
      if (!sdk) {
        throw "idverse-sdk-ui tag does not exist";
      }

      sdk.recognizers = [SdkType.IDScan, SdkType.FaceScan];
      sdk.enableDFA = enableDFA;
      // INFO: Face Match the Document Scan & Liveness Scan
      sdk.enableFaceMatch = enableFaceMatch;

      sdk.addEventListener("scanSuccess", onScanSuccess);
      sdk.addEventListener("scanFail", onScanFail);
      sdk.addEventListener("tryAgain", onTryAgain);
      sdk.addEventListener("error", (e) => onError(e as any));
      sdk.addEventListener("fatalError", (e) => onError(e as any));
      sdk.addEventListener("done", onDone);
      sdk.addEventListener("payload", onPayload);

      sdk.addEventListener("authenticated", (e) => {
        console.log("authenticated", e);
        setInit(e.detail);
        setLoading(false);
      });
      sdk.addEventListener("ready", onReady);

      sdk.addEventListener("faceScanClosed", (e) => {
        console.log("face scan closed", e);
        setLoading(false);
      });

      setIdverseSDK(sdk);
    }
  }, [sessionToken, enableDFA, enableFaceMatch]);

  /**
   * Handles starting the process.
   *
   * @param {Boolean} state - Whether to scan both sides of the ID
   */
  const handleStart = async (state: boolean) => {
    if (!idverseSDK) return;
    setLoading(true);
    idverseSDK.setScanBothSides(state);
    try {
      idverseSDK.startIDScan();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  /**
   * Handles starting the liveness scan.
   */
  const handleStartLiveness = async () => {
    if (!idverseSDK) return;
    setLoading(true);
    try {
      idverseSDK.startFaceScan();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  /**
   * Handles closing the session.
   */
  const handleDone = async () => {
    if (!idverseSDK) return;
    setResultData(undefined);
    setSessiontoken(undefined);
    setBuildId(undefined);
    setLoading(true);
    await idverseSDK.close();
    setLoading(false);
    setInit(false);
  };

  /**
   * Handles continuing the session. Allows the user to continue scanning multiple times.
   */
  const handleContinue = async () => {
    if (!idverseSDK) return;
    setResultData(undefined);
  };

  /**
   * Handles initializing the session.
   */
  const handleInit = () => {
    const token = (document.getElementById("token") as HTMLInputElement)?.value;
    if (token && sessionUrl && buildId) {
      setSessiontoken(token);
      // Save the session token and build ID to local storage for convenience
      localStorage.setItem(STORAGE_KEY, sessionUrl);
      localStorage.setItem(BUILD_KEY, buildId);
    }
    setLoading(true);
  };

  /**
   * Renders the component.
   */
  return (
    <div>
      {resultData ? (
        <Details
          details={resultData}
          onContinue={() => handleContinue()}
          onDone={() => handleDone()}
        />
      ) : (
        <div className="App">
          <div className="container">
            <div className="header">
              <img src="/logo.svg" width={200} alt="OCR Labs logo" />

              <h1>Document and Liveness 5 Flow Example</h1>
              <p>
                {loading
                  ? "Loading..."
                  : init
                  ? "Choose one of the options below."
                  : "Please enter your session token and build ID."}
              </p>
            </div>

            {!init && !loading && (
              <div className="input-group">
                <div className="input-field">
                  <label htmlFor="token">Session Token</label>
                  <input
                    type="text"
                    id="token"
                    placeholder="Enter session token"
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="buildId">Build ID</label>
                  <input
                    type="text"
                    id="buildId"
                    placeholder="Enter build ID"
                    value={buildId}
                    onChange={(e) => setBuildId(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="enableDFA">Enable DFA</label>
                  <input
                    type="checkbox"
                    id="enableDFA"
                    onChange={() => setEnableDFA(!enableDFA)}
                    checked={enableDFA}
                  />
                </div>
                <div>
                  <label htmlFor="enableFaceMatch">Enable Face Match</label>
                  <input
                    type="checkbox"
                    id="enableFaceMatch"
                    onChange={() => setEnableFaceMatch(!enableFaceMatch)}
                    checked={enableFaceMatch}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="sessionUrl">Session API URL</label>
                  <input
                    type="text"
                    id="sessionUrl"
                    placeholder="Enter session URL"
                    onChange={(e) => setSessionUrl(e.target.value)}
                    value={sessionUrl}
                  />
                </div>
                <div>
                  <button onClick={handleInit} className="my-button">
                    Init
                  </button>
                </div>
              </div>
            )}

            <div className="actions">
              {loading && (
                <div className="loading">
                  <img src="/images/loading.svg" alt="" />
                </div>
              )}
              {!loading && error == null && init && (
                <>
                  <div onClick={() => handleStart(false)}>
                    <div className="icon">
                      <img src="/images/frontID.svg" alt="" />
                    </div>
                    <p>Front of ID</p>
                  </div>
                  <div onClick={() => handleStart(true)}>
                    <div className="icon">
                      <img src="/images/backID.svg" alt="" />
                    </div>
                    <p>Front and Back of ID</p>
                  </div>
                  <div onClick={() => handleStartLiveness()}>
                    <div className="icon">
                      <img src="/images/liveness.svg" alt="" />
                    </div>
                    <p>Liveness Capture</p>
                  </div>
                  <div onClick={() => handleDone()}>
                    <p>Complete</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {error && (
        <idv-modal warning visible heading="An error occurred.">
          <p>{error}</p>
          <div className="buttons">
            <idv-button
              onClick={() => reset()}
              class="button"
              label="Close"
              variant="primary outline"
            ></idv-button>
          </div>
        </idv-modal>
      )}

      {sessionToken && buildId && (
        <idverse-sdk-ui
          session-url={sessionUrl}
          session-token={sessionToken}
          session-build-id={buildId}
          enable-dfa={enableDFA}
          enable-face-match={enableFaceMatch}
          auto-complete={false}
        ></idverse-sdk-ui>
      )}
    </div>
  );
}

export default App;
