<template>
  <div class="footer">
    <div class="content-width">ReputagX&#169 2023</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'footer-component',
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.footer {
  flex-shrink: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #777E90;
  background: #fff;
  border: 0.5px solid #94a3b8;
}
</style>
