<script setup lang="ts">
const props = defineProps<{
  details: any;
  onClose: () => void;
}>();

const handleClose = () => {
  props.onClose();
};

const fields: any[] = [];

const order = [
  "full_name",
  "given_name",
  "first_name",
  "middle_name",
  "last_name",
  "document_number",
  "birth_date",
  "expiry_date",
  "document_id",
];

props.details.sort(function (a: any, b: any) {
  var indexA = order.indexOf(a.fieldName);
  var indexB = order.indexOf(b.fieldName);

  // If one of the field names is not present in the order array,
  // it should come after the ones that are present.
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
});

for (let i = 0; i < props.details.length; i++) {
  const field: any = props.details[i];
  fields.push({
    label: field.fieldName.replace(/_/g, " "),
    name: field.fieldName,
    value: field.fieldValue,
  });
}
</script>

<template>
  <div class="details">
    <div class="form">
      <h4>Extracted details</h4>
      <div v-for="field in fields" :key="field.name" class="form-control">
        <label htmlFor="field.name">{{ field.label }}</label>
        <input
          disabled
          type="text"
          name="field.name"
          value="field.value"
          id="field.name"
        />
      </div>
    </div>

    <footer>
      <button @click="handleClose">Close</button>
    </footer>
  </div>
</template>

<style scoped lang="css">
.form {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #fff;
  padding: 20px;
  overflow: auto;
  animation: slideLeft 0.2s forwards;
  z-index: 6;
  padding-bottom: 120px;

  h4 {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
    margin-bottom: 15px;
    margin-top: 20px;
    color: #000000;
  }

  .form-control {
    margin-bottom: 10px;
    border: 1px solid #dedede;
    border-radius: 3px;
    padding: 9px 11px;
    height: 52px;
    max-width: 400px;
    position: relative;

    label {
      text-transform: capitalize;
      font-size: 11px;
      font-weight: 500;
      display: block;
      margin: 0;
      color: #707070;
    }

    input,
    textarea {
      color: #000000;
      border: 0;
      background: transparent;
      height: 20px;
      width: 100%;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
      -webkit-appearance: none;
      appearance: none;
      transition: all 0.15s ease;
      outline: none;
      font-size: 14px;
      border-radius: 0;
      padding-left: 0;

      &:disabled {
        color: black;
        opacity: 1;
      }
    }
  }
}

footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 11;
  padding: 20px;
  animation: slideLeft 0.2s forwards;
  display: flex;
  background: #ffffff;
  box-shadow: 1px 0px 14px #eee;

  button {
    margin-top: 10px;
    border-radius: 10px;
    border: 0;
    height: 48px;
    width: 100%;
    max-width: 400px;
    background-color: #051c2c;
    color: #ffffff;
    font-size: 18px;
    font-weight: 500;
    padding: 4px 0px;

    &:first-child {
      background-color: transparent;
      color: #051c2c;
      border: 1px solid #051c2c;
      margin-right: 5px;
    }
    &:last-child {
      margin-left: 5px;
    }
  }
}

@keyframes slideLeft {
  0% {
    transform: translateX(900px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
