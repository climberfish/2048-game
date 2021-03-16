<template>
  <div :class="`piece ${numberClass}`">{{ value }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: Number,
  },
  computed: {
    numberClass(): string {
      if (!this.value) return '';
      if (this.value > 2048) return '-nGrande';
      return `-n${this.value}`;
    },
  },
});
</script>

<style scoped>
.piece {
  display: flex;
  margin: 0.1rem;
  width: 25%;
  font-weight: bold;
  border-radius: 0.1rem;
  color: #f9f6f2;
  background-color: #cdc1b4;
  align-items: center;
  justify-content: center;
}
.piece.-n2    { background-color: #eee4da; color: #776e65; }
.piece.-n4    { background-color: #eee1c9; color: #776e65; }
.piece.-n8    { background-color: #f2b179; }
.piece.-n16   { background-color: #f59563; }
.piece.-n32   { background-color: #f67c5f; }
.piece.-n64   { background-color: #f65e3b; }
.piece.-n128  { background-color: #edcf72; }
.piece.-n256  { background-color: #edcc61; }
.piece.-n512  { background-color: #edc850; }
.piece.-n1024 { background-color: #edc53f; }
.piece.-n2048 { background-color: #edc22e; }
.piece.-nGrande { background-color: #111115; }

.piece.-n128,
.piece.-n256,
.piece.-n512 {
  font-size: 0.625rem;
}
.piece.-n1024,
.piece.-n2048,
.piece.-nGrande {
  font-size: 0.5rem;
}
</style>
