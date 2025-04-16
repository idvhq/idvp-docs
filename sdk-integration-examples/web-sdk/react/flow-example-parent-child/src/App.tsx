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
  const [is_sdk_face_scan_loaded, set_is_sdk_face_scan_loaded] =
    useState(false);
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
      sdk.loadIDScan().then(() => set_is_sdk_id_scan_loaded(true));
      sdk.loadFaceScan().then(() => set_is_sdk_face_scan_loaded(true));
    };

    const onScanSuccess = (e: IdverseSdkUiCustomEvent<any>) => {
      console.log('Scan Success', e);
      if (e.detail.sdkType === SdkType.IDScan) {
        const res = e.detail.result?.details?.extractedInfo?.viz;
        if (res) {
          set_current_step(Step.ReviewDetails);
          setResultData(res);
        }
      }

      if (e.detail.sdkType === SdkType.FaceScan) {
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
    if (is_sdk_face_scan_loaded) {
      sdk_ref.current?.startFaceScan();
    }
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
      {current_step == Step.ReviewDetails && (
        <Details
          details={resultData}
          onContinue={handleStartFaceScan}
          is_sdk_face_scan_loaded={is_sdk_face_scan_loaded}
        />
      )}

      {current_step == Step.End && <End />}

      <idverse-sdk-ui
        session-url={sessionUrl}
        session-token={sessionToken}
        session-build-id={buildId}
        enable-dfa={true}
        skip-face-scan-intro={true}
      />
    </div>
  );
}
