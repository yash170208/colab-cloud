<template>
  <div class="full">
    <div
      class="outer d-flex flex-column justify-content-around align-items-center"
      v-click-away="closeModal"
    >
      <div class="heading"><slot name="heading"> Modal Heading </slot></div>
      <div>
        <slot name="body" class="container"> Modal Body </slot>
      </div>
      <div>
        <slot name="footer" class="footer">
          <button class="btn btn-danger" @click="closeModal">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  emits: ["close-modal"],
  data() {
    return {};
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style scoped>
.footer{
  display: flex;
  justify-content: space-between;
}
.heading {
  font-size: 22pt;
  text-align: center;
}
.outer {
  color: white;
  padding: 20px;
  background-color: #2f3133;
  border-radius: 20px;
  position: fixed;
  top: 25vh;
  left: 25vw;
  width: 50vw;
  height: 50vh;
  z-index: 100;
}
.full {
  position: fixed;
  background-color: red;
  z-index: 10;
  width: 100vw;
  height: 100vh;
}
</style>