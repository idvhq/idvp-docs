import { useEffect, useState } from 'react';

type IdScanProps = {
  sdk: HTMLIdverseSdkUiElement;
  is_sdk_id_scan_loaded: boolean;
};

export function IdScan({ sdk, is_sdk_id_scan_loaded }: IdScanProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (is_sdk_id_scan_loaded) {
      sdk.startIDScan();
    }

    const onScannerCreated = (e) => {
      console.log('scannerCreated:', { e });
      setIsLoading(false);
    };

    sdk.addEventListener('scannerCreated', onScannerCreated);

    return () => sdk.removeEventListener('scannerCreated', onScannerCreated);
  }, [is_sdk_id_scan_loaded, sdk]);

  if (isLoading) {
    // You can use other Loading ui if you want, this is optional
    return <idv-id-scan-intro visible={true} description={'Preparing'} />;
  }

  return (
    <div>
      <h1>IdScan </h1>
      <div>
        This should not appear in practice as SDK will be on top when scannning
        and "Loading" part when not
      </div>
    </div>
  );
}
