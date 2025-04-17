import { useEffect, useState } from 'react';

type IdScanProps = {
  sdk: HTMLIdverseSdkUiElement;
  is_sdk_id_scan_loaded: boolean;
};

export function IdScan({ sdk, is_sdk_id_scan_loaded }: IdScanProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (is_sdk_id_scan_loaded) {
      // Once the id scan wasm was loaded we can call `sdk.startIDScan();`
      // As we use eager loading in the parent component,
      // this will save us some time in comparison to only have benn called `sdk.startIDScan()` directly
      sdk.startIDScan();
    }

    const onScannerCreated = (e) => {
      // This event `scannerCreated` is useful to tell you that in this moment,
      // the scan process will beging
      // the SDK UI screen "Get Ready to Scan the Front of your ID" appears at this moment
      console.log('scannerCreated:', { e });

      // So we hide our custom loading UI so it doesn't interfere with the builtin SDK UI
      // In some case you might not need to hide your loading UI, as builtin SDK UI has a z-index
      // that makes it on top of everything, but if you are using a UI that also has similar z-index priority
      // you will need to hide it (i.e when using explictly the built-in <idv-id-scan-intro/> as your loading UI )
      setIsLoading(false);
    };

    sdk.addEventListener('scannerCreated', onScannerCreated);

    return () => sdk.removeEventListener('scannerCreated', onScannerCreated);
  }, [is_sdk_id_scan_loaded, sdk]);

  if (isLoading) {
    // You can use other Loading ui if you want, use of built-in <idv-id-scan-intro/> is optional.
    // You can even use the same message (instead of  "Preparing" in this example) to make it appear is the same UI when the Scan process actually begin
    return <idv-id-scan-intro visible={true} description={'Preparing'} />;
  }

  return (
    <div>
      <h1>IdScan </h1>
      <div>
        This should not appear in practice as SDK will be on top when scannning
        and your custom "Loading" UI part when not
      </div>
    </div>
  );
}
