<script setup lang="ts">
import { ref, onMounted } from "vue";
import Details from "./Details.vue";
import "@idverse/idverse-sdk-browser/ui";
import {
  FaceScanRecognizerResult,
  IdverseSdkUiCustomEvent,
} from "@idverse/idverse-sdk-browser/ui";
import { SdkType } from "@idverse/idverse-sdk-browser";


// Vue define state
const loading = ref(true);
const ready = ref(false);
const error = ref<string>();
const resultData = ref<FaceScanRecognizerResult>();
const idverseSDK = ref<HTMLIdverseSdkUiElement | null>(null);

const onSdkReady = () => {
  loading.value = false;
  ready.value = true;
  console.log("Successfully loaded");
};

const onScanSuccess = (ev: IdverseSdkUiCustomEvent<any>) => {
  console.log(ev.detail);
  resultData.value = ev.detail;
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
};

const closeSession = () => {
  idverseSDK.value?.close();
}

const handleStart = async () => {
  if (!idverseSDK.value || !ready.value) return;
  try {
    idverseSDK.value.startFaceScan();
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

  sdk.recognizers = [SdkType.FaceScan];
  sdk.enableDFA = false;
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
    <button type="button" @click="handleStart()">Start Face ID Scan</button>
  </div>

  <div v-if="error">
    <idv-modal warning visible heading="An error occurred.">
      <p>{{ error }}</p>
      <div>
        <idv-button @click="unsetError" label="Close" variant="primary outline"></idv-button>
      </div>
    </idv-modal>
  </div>

  <div v-if="resultData">
    <Details :details="resultData" @close="unsetResultData" @tryAgain="unsetResultData" />
  </div>

  <idverse-sdk-ui sessionURL="http://localhost:3000" sessionToken="a0dab893-c77d-54f7-96c1-f31ebbdaba4a"
    build-id="1234567890"></idverse-sdk-ui>

  <p class="read-the-docs">Click on the Idverse logo to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
