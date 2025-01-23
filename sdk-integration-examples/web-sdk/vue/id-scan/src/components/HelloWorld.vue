<script setup lang="ts">
import { ref, onMounted } from "vue";
import Details from "./Details.vue";
import "@idverse/idverse-sdk-browser/ui";
import {
  IDScanRecognizerResult,
  IdverseSdkUiCustomEvent,
} from "@idverse/idverse-sdk-browser/ui";
import { SdkType } from "@idverse/idverse-sdk-browser";

// Vue define state
const loading = ref(true);
const ready = ref(false);
const error = ref<string>();
const scanBothSides = ref(false);
const resultData = ref<IDScanRecognizerResult>();
const idverseSDK = ref<HTMLIdverseSdkUiElement | null>(null);

const onSdkReady = () => {
  console.log("Successfully loaded");
  loading.value = false;
};

const onScanSuccess = (ev: IdverseSdkUiCustomEvent<any>) => {
  console.log(ev.detail);
  resultData.value = ev.detail.result.details.extractedInfo.viz;
};

const onScanFail = (ev: IdverseSdkUiCustomEvent<any>) => {
  console.log("failed to scan.", ev);
  error.value = ev.detail.toString();
};

const onError = (ev: IdverseSdkUiCustomEvent<any>) => {
  loading.value = false;
  error.value = ev.detail.message.toString();
  console.error("SDKError", ev.detail);
};

const onAuthenticated = (ev: IdverseSdkUiCustomEvent<any>) => {
  console.log("authenticated", ev);
  loading.value = false;
  ready.value = true;
};

const closeSession = () => {
  idverseSDK.value?.close();
};

const handleStart = async (state: boolean) => {
  if (!idverseSDK || !ready) return;
  loading.value = true;
  scanBothSides.value = state;
  idverseSDK.value?.setScanBothSides(state);
  try {
    idverseSDK.value?.startIDScan();
  } catch (e) {
    console.error(e);
  }
};

const unsetError = () => {
  error.value = undefined;
};

const unsetResultData = () => {
  resultData.value = undefined;
  closeSession();
};

onMounted(() => {
  const sdk = document.querySelector(
    "idverse-sdk-ui"
  ) as HTMLIdverseSdkUiElement;
  if (!sdk) {
    throw "idverse-sdk-ui tag does not exist";
  }

  sdk.recognizers = [SdkType.IDScan];
  sdk.enableDFA = true;
  // INFO: Set to 'true' when used in combination with FaceScan
  sdk.enableFaceMatch = false;

  sdk.addEventListener("ready", onSdkReady);
  sdk.addEventListener("fatalError", onError);
  sdk.addEventListener("scanFail", onScanFail);
  sdk.addEventListener("scanSuccess", onScanSuccess);
  sdk.addEventListener("authenticated", onAuthenticated);
  idverseSDK.value = sdk;
});
</script>

<template>
  <div v-if="loading" class="card">
    <img src="../assets/loading.svg" alt="Loading icon" />
  </div>
  <div v-else class="card">
    <button type="button" @click="handleStart(false)">
      Start ID Check Front Side
    </button>
    <button type="button" @click="handleStart(true)">
      Start ID Check Both Sides
    </button>
  </div>

  <div v-if="error">
    <idv-modal warning visible heading="An error occurred.">
      <p>{{ error }}</p>
      <div>
        <idv-button
          @click="unsetError"
          label="Close"
          variant="primary outline"
        ></idv-button>
      </div>
    </idv-modal>
  </div>

  <div v-if="resultData">
    <Details :details="resultData" @close="unsetResultData" />
  </div>

  <idverse-sdk-ui
    session-url="YOUR_SESSION_URL"
    session-token="YOUR_SESSION_TOKEN"
    session-build-id="YOUR_SESSION_BUILD_ID"
  ></idverse-sdk-ui>

  <p class="read-the-docs">Click on the Idverse logo to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
