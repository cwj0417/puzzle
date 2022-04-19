<script setup lang="ts">
import splitPicToPuzzle from './utils/splitPicToPuzzle'
import fileToBase64 from './utils/fileToBase64'
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

const puzzleChips = ref<any>([])
const bg = ref<string>('')
const imgRadio = ref<number>(1);
const puzzleWrapWidth = document.body.clientWidth
const showOriginPic = ref<boolean>(false)
const gameInfo = reactive({
  start: Date.now(),
  counting: 0,
})
let intervalId: number = 0
onMounted(() => {
  intervalId = setInterval(() => {
    if (gamestatus.value === 'PUZZLE') {
      gameInfo.counting = Math.round((Date.now() - gameInfo.start) / 1000)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const gamestatus = computed<'READY' | 'SUCCESS' | 'PUZZLE'>(() => {
  const isSuccess = () => {
    let result = true
    for (let i = 0; i < puzzleChips.value.length - 1; i++) {
      if (puzzleChips.value[i].index > puzzleChips.value[i + 1].index) {
        result = false
        break
      }
    }
    return result
  }
  if (puzzleChips.value.length === 0) {
    return 'READY'
  } else if (isSuccess()) {
    return 'SUCCESS'
  } else {
    return 'PUZZLE'
  }
})

const puzzleSize = reactive({
  x: 5,
  y: 5,
})
const onPicChange = (event: any) => {
  if (event.target?.files?.length) {
    fileToBase64(event.target.files[0], (base64: string, radio: number) => {
      bg.value = base64
      imgRadio.value = radio
    })
    splitPicToPuzzle(event.target.files[0], puzzleSize.x, puzzleSize.y, (puzzle: any) => {
      puzzleChips.value = puzzle.map((dataurl: any, index: any) => ({
        index,
        dataurl
      })).sort((i: any) => Math.random() - 0.5)
      gameInfo.start = Date.now()
    })
  }
}

let dragIndex: any = null

const dragstart = (index: number, e: any) => {
  e.dataTransfer.setData('text/plain', 'This text may be dragged')
  dragIndex = index
}
const drop = (index: number, e: Event) => {
  e.preventDefault();
  [puzzleChips.value[index], puzzleChips.value[dragIndex]] = [puzzleChips.value[dragIndex], puzzleChips.value[index]]
}
</script>

<template>
  <div class="wrapper">
    <div v-if="!bg">
      <br>
      <br>
      <br>
      x: <input type="number" v-model="puzzleSize.x">
      <br>
      <br>
      y: <input type="number" v-model="puzzleSize.y">
      <br>
      <br>
      <input type="file" @change="onPicChange">
    </div>
    <h1>{{ gamestatus }}</h1>
    <h2 v-if="gamestatus !== 'READY'">{{ gameInfo.counting }}</h2>
    <div :style="{ width: puzzleWrapWidth, display: 'flex', flexWrap: 'wrap', padding: '10px' }">
      <div draggable="true" @dragstart="dragstart(index, $event)" @drop="drop(index, $event)" ondragover="return false"
        v-for="puzzlechip, index of puzzleChips" :style="{
          background: `url(${puzzlechip.dataurl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: ((puzzleWrapWidth - puzzleSize.x - 5) / puzzleSize.x) + 'px',
          height: ((puzzleWrapWidth - puzzleSize.x - 5) / puzzleSize.x) * imgRadio + 'px',
          margin: '0 1px 1px 0'
        }" :key="puzzlechip.index" />
    </div>
    <div class="operate" v-if="bg">
      <button @click="showOriginPic = !showOriginPic">
        {{ showOriginPic ? '隐藏原图' : '显示原图' }}
      </button>
      <button @click="bg = ''; puzzleChips = []">
        重新选图
      </button>
    </div>
    <div v-if="showOriginPic" @click="showOriginPic = false" style=" position:absolute; top: 0; left: 10;">
      <img :src="bg" style="width: 100%;">
    </div>
  </div>
</template>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.wrapper {
  overflow: auto;
  background-color: #00b1ff21;
  height: 100%;
}

.operate {
  padding: 40px;
}

button {
  padding: 10px;
  margin-right: 10px;
  font-size: 20px;
}
</style>
