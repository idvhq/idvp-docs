<script setup lang="ts">
import { ref, onMounted } from "vue";
import Details from "./Details.vue";
import "@idverse/idverse-sdk-browser/ui";
import {
  IDScanProcessStatus,
  IDScanRecognizerResult,
  IdverseSdkUiCustomEvent,
  SdkError,
} from "@idverse/idverse-sdk-browser/ui";

// Vue define state
const loading = ref(true);
const ready = ref(false);
const error = ref<string>();
const scanBothSides = ref(false);
const resultData = ref<IDScanRecognizerResult>();
const idverseSDK = ref<HTMLIdverseSdkUiElement | null>(null);

const onSdkReady = () => {
  loading.value = false;
  ready.value = true;
  console.log("Successfully loaded");
};

const onScanSuccess = (ev: IdverseSdkUiCustomEvent<IDScanRecognizerResult>) => {
  console.log(ev.detail);
  resultData.value = res.detail;
};

const onScanFail = (ev: IdverseSdkUiCustomEvent<IDScanProcessStatus>) => {
  console.log("failed to scan.", ev);
  error.value = ev.detail.toString();
};

const onError = (ev: IdverseSdkUiCustomEvent<SdkError>) => {
  loading.value = false;
  error.value = ev.detail.message.toString();
  console.error("SDKError", ev.detail);
};

const handleStart = async (state: boolean) => {
  if (!idverseSDK || !ready) return;
  scanBothSides.value = state;
  try {
    idverseSDK.value.startScanning();
  } catch (e) {
    console.error(e);
  }
};

const unsetError = () => {
  error.value = null;
};

onMounted(() => {
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

  idverseSDK.value = sdk;
});
</script>

<template>
  <div v-if="loading" class="card">
    <img src="../assets/loading.svg" alt="Loading icon" />
  </div>
  <div v-else class="card">
    <button type="button" @click="handleStart(true)">
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
    <Details
      results="resultData"
      @close="unsetResultData"
      @tryAgain="unsetResultData"
    />
  </div>

  <idverse-sdk-ui
    sessionURL="http://localhost:3000"
    sessionToken="a0dab893-c77d-54f7-96c1-f31ebbdaba4a"
    type="ID_SCAN"
    scanBothSides="scanBothSides"
  ></idverse-sdk-ui>

  <p class="read-the-docs">Click on the Idverse logo to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
