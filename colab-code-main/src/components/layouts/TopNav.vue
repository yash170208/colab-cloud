<template>
  <div class="topnav d-flex align-items-center justify-content-between">
    <div>
      <select
        v-on:change="langChange"
        class="form-select m-2"
        aria-label="Select language"
        ref="lang"
      >
        <option value="javascript" selected>Javascript</option>
        <option value="typescript">Typescript</option>
        <option value="c_cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="csharp">C#</option>
        <option value="plain_text">Plain Text</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>
    </div>

    <div class="d-flex justify-content-center align-items-center">
      <b-icon
        title="Run"
        class="round mx-2"
        icon="play-circle"
        variant="secondary"
        @click="runCode"        
      ></b-icon>
      <b-icon
        title="Upload Code"
        class="round mx-2"
        icon="file-earmark-arrow-up"
        variant="secondary"
        @click="upload"
      ></b-icon>
      <b-icon
        title="Download Code"
        class="round mx-2"
        icon="file-earmark-arrow-down"
        variant="secondary"
        @click="saveCode"
      ></b-icon>
      <b-icon
        title="Colab Mode"
        class="round mx-2"
        icon="people-fill"
        variant="secondary"
        @click="colabModal"
      ></b-icon>
      <b-icon
        title="Clear Cache"
        class="round mx-2"
        icon="trash"
        variant="danger"
        @click="clearStore"
      ></b-icon>
    </div>
  </div>
</template>

<style scoped>
.round {
  height: 38px;
  width: 38px;
}
.round:nth-child(1):hover {
  color: green;
}
.round:nth-child(2):hover {
  color: yellow;
}
.round:nth-child(3):hover {
  color: yellow;
}
.round:nth-child(5):hover {
  color: red;
}
.topnav {
  background-color: #003367;
  padding: 20px;
}
.round {
  border-radius: 20px;
}
.form-select {
  min-width: 150px;
}
</style>

<script>
export default {
  emits: ["change-language", "save-code", "upload", "clear-store", "run-code", "colab"],
  mounted() {
    if (localStorage.getItem("code")) {
      this.$refs.lang.value = localStorage.getItem("lang");
    }
    this.langChange();
  },
  data() {
    return {};
  },
  methods: {
    runCode(){
      this.$emit('run-code')
    },
    clearStore(){
      this.$emit('clear-store')
    },
    upload() {
      this.$emit("upload");
    },
    saveCode() {
      this.$emit("save-code");
    },
    langChange() {
      let language = this.$refs.lang.value;
      this.$emit("change-language", language);
    },
    colabModal() {
      this.$emit('colab');
    }
  },
};
</script>