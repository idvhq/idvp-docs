const sessionUrl = import.meta.env.VITE_SDK_SESSION_URL;
const sessionToken = import.meta.env.VITE_SDK_SESSION_TOKEN;
const buildId = import.meta.env.VITE_SDK_SESSION_BUILD_ID;

import { useState, useEffect, useRef } from 'react';
import './App.css';
import { IdverseSdkUiCustomEvent } from '@idverse/idverse-sdk-browser/ui';
import { SdkType } from '@idverse/idverse-sdk-browser';

import { Details } from './components/Details/Details';
import { Intro } from './components/Intro';
import { IdScan } from './components/IdScan';
import { End } from './components/End';

enum Step {
  Intro,
  IdScan,
  ReviewDetails,
  End,
}

export function App() {
  const [current_step, set_current_step] = useState(Step.Intro);
  const [is_sdk_id_scan_loaded, set_is_sdk_id_scan_loaded] = useState(false);
  const [resultData, setResultData] = useState<any>();

  const sdk_ref = useRef<HTMLIdverseSdkUiElement>();

  useEffect(() => {
    const sdk = document.querySelector(
      'idverse-sdk-ui'
    ) as HTMLIdverseSdkUiElement;
    if (!sdk) {
      throw 'idverse-sdk-ui tag does not exist';
    }

    sdk.recognizers = [SdkType.IDScan, SdkType.FaceScan];

    sdk_ref.current = sdk;

    const onAuthenticated = () => {
      console.log('authenticated');
      // Eager Loading:
      // As soon as we are authenticated, we call sdk.loadIDScan()
      // Assuming you will scan ID first
      sdk.loadIDScan().then(() => set_is_sdk_id_scan_loaded(true));

      // We can also call sdk.loadFaceScan() here, i.e
      // sdk.loadFaceScan().then(() => set_is_sdk_face_scan_loaded(true));
      // But we can save some network bandwidth and call it later but before reaching the face scan step to use eager loading and save some time
      // In this example we are calling loadFaceScan() once we reach `Details` screen
    };

    const onScanSuccess = (e: IdverseSdkUiCustomEvent<any>) => {
      console.log('Scan Success', e);

      if (e.detail.sdkType === SdkType.IDScan) {
        // When ID Scan, the extracted details are found here
        const res = e.detail.result?.details?.extractedInfo?.viz;
        if (res) {
          set_current_step(Step.ReviewDetails);
          setResultData(res);
        }

        // Also take into account we provide an id to refer to the document that as this point has been uploaded to your Idverse workspace tenant
        const document_id = e.detail.id;
        console.log({ document_id });
      }

      if (e.detail.sdkType === SdkType.FaceScan) {
        // When Face Scan, there is no much info rather than the sdkType itself and the id of the video/resource has been uploaded to your Idverse workspace tenant
        const face_id = e.detail.id;
        console.log({ face_id });

        set_current_step(Step.End);
      }
    };

    sdk.addEventListener('authenticated', onAuthenticated);
    sdk.addEventListener('scanSuccess', onScanSuccess);

    return () => {
      sdk.removeEventListener('authenticated', onAuthenticated);
    };
  }, []);

  const handleContinueFromIntro = () => {
    set_current_step(Step.IdScan);
  };

  const handleStartFaceScan = () => {
    sdk_ref.current?.startFaceScan();
  };

  return (
    <div className="App">
      {current_step == Step.Intro && (
        <Intro onContinue={handleContinueFromIntro} />
      )}
      {sdk_ref.current && current_step == Step.IdScan && (
        <IdScan
          sdk={sdk_ref.current}
          is_sdk_id_scan_loaded={is_sdk_id_scan_loaded}
        />
      )}
      {sdk_ref.current && current_step == Step.ReviewDetails && (
        <Details
          sdk={sdk_ref.current}
          details={resultData}
          // In this example `onContinue` is called only if face scan wasm was loaded
          // (see eager loading logic in `Details` component)
          onContinue={handleStartFaceScan}
        />
      )}

      {sdk_ref.current && current_step == Step.End && (
        // We call sdk.close() in this step. See inside `End` component
        <End sdk={sdk_ref.current} />
      )}

      {/* Initialize endpoint is called as soon as <idverse-sdk-ui/> is in the DOM */}
      <idverse-sdk-ui
        session-url={sessionUrl}
        session-token={sessionToken}
        session-build-id={buildId}
        // Use `enable-dfa` prop to choose whether or not DFA engine is enabled, if value is static and will not change
        // If for some reason value is dynamic (needs to change) use `sdk.setEnableDFA()`
        enable-dfa={true}
        // Use `enable-face-match` prop to choose whether or not FaceMatch engine is enabled, if value is static and will not change
        // If for some reason value is dynamic (needs to change) use `sdk.setEnableFaceMatch()`
        enable-face-match={true}
        skip-face-scan-intro={true}
      />
    </div>
  );
}
