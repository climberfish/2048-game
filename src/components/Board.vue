<template>
  <div class="board">
    <div v-for="row of board" :key="row" class="row">
      <Piece v-for="(cell, index) of row" :key="index" :value="cell" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Piece from '@/components/Piece.vue';

export default defineComponent({
  props: ['board'],
  components: { Piece },
});
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  padding: 0.1rem;
  background-color: #bbada0;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 0.1rem;
}
.row {
  display: flex;
  flex: 1;
}
</style>
