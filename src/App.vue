<template>
  <header>
    <h1>2048</h1>
    <button @click="this.newGame" class="btn-new-game">Novo jogo</button>
  </header>
  <section class="game">
    <Board
      :value="2"
      :board="game.board()"
    />
    <div class="message">{{ finishMessage }}</div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Board from '@/components/Board.vue';
import Game2048, { Movement } from '@/application/game2048';

const keyToMove: Record<string, Movement> = {
  ArrowUp: Movement.UP,
  ArrowDown: Movement.DOWN,
  ArrowRight: Movement.RIGHT,
  ArrowLeft: Movement.LEFT,
};

export default defineComponent({
  name: 'App',
  components: { Board },
  data() {
    return {
      game: Game2048.randomGame(),
    };
  },
  computed: {
    finishMessage() {
      if (this.game.won()) return 'Você venceu!';
      if (this.game.lost()) return 'Você perdeu!';
      return 'Bora!';
    },
  },
  mounted() {
    window.addEventListener('keydown', this.keyDown);
  },
  methods: {
    keyDown(e: KeyboardEvent) {
      const { key } = e;
      const move = keyToMove[key];
      if (move) this.game.moveTo(move);
    },
    newGame() {
      this.game = Game2048.randomGame();
    },
  },
});
</script>

<style>
:root {
  --font-size-large: min(12vw, 12vh);
}
html {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: var(--font-size-large);
  background-color: #faf8ef;
  color: #776e65;
}
h1 {
  font-size: 1.5rem;
  margin: 0;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0.2rem;
}
.message {
  margin: 0.25rem;
  text-align: center;
  font-weight: bold;
}
.btn-new-game {
  cursor: pointer;
  height: auto;
  font-size: 0.4rem;
  font-weight: bold;
  color: #f9f6f2;
  padding: 5px 15px;
  border: none;
  background-color: #8f7a66;
}
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
