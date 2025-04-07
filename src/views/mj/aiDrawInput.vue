<script setup lang="ts">
import { NTabPane, NTabs } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import aiDrawInputItem from './aiDrawInputItem.vue'
import aiFace from './aiFace.vue'
import aiBlend from './aiBlend.vue'
import aiDall from './aiDall.vue'
import aiIdeoInput from './aiIdeoInput.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { SvgIcon } from '@/components/common'
import { gptServerStore } from '@/store'

// 获取当前路由对象
const $emit = defineEmits(['drawSent', 'close'])
const route = useRoute()
const drawSent = (d: any) => $emit('drawSent', d)
const { isMobile } = useBasicLayout()

const st = ref({ drawType: 'draw', tab: '' })

onMounted(() => {
  // st.value.drawType='draw'
  if (gptServerStore.myData.DRAW_TYPE)
    st.value.drawType = gptServerStore.myData.DRAW_TYPE
})

// watch(()=>st.value.drawType, (n:string)=> {
//   mlog('st.value.drawType',n)
//   gptServerStore.setMyData({DRAW_TYPE:n})
// } )

const handleUpdateValue = (v: string) => {
  // mlog("handleUpdateValue",v)
  gptServerStore.setMyData({ DRAW_TYPE: v })
}
const initLoad = () => {
  if (route.query.tab) {
    st.value.tab = 'midjourney'// route.query.tab as string;
    const tt = (route.query.tab as string).toLocaleLowerCase()
    if (['dall.e', 'ideogram'].includes(tt))
      st.value.tab = tt

    handleUpdateValue(st.value.tab)
  }
  else { st.value.tab = (gptServerStore.myData.DRAW_TYPE ? gptServerStore.myData.DRAW_TYPE : 'midjourney') }
}
initLoad()
</script>

<template>
  <div class="overflow-y-auto bg-[#fafbfc] pt-2 dark:bg-[#18181c] h-full ">
    <NTabs type="line" animated :default-value="st.tab" @update:value="handleUpdateValue">
      <NTabPane name="start" tab="" />
      <NTabPane name="midjourney" tab="MidJourney">
        <!--  -->
        <NTabs type="segment" animated default-value="draw23" size="small">
          <NTabPane name="draw23" :tab="$t('mjchat.draw')">
            <aiDrawInputItem @draw-sent="drawSent" @close="$emit('close')" />
          </NTabPane>
          <!-- <n-tab-pane name="chap2" tab="第二章">2</n-tab-pane>
        <n-tab-pane name="chap3" tab="第三章">3</n-tab-pane> -->
          <NTabPane name="face" :tab="$t('mjchat.face')">
            <div class="p-4">
              <aiFace />
            </div>
          </NTabPane>
          <NTabPane name="blend" :tab="$t('mjchat.blend')">
            <div class="p-4">
              <aiBlend />
            </div>
          </NTabPane>
        </NTabs>
      </NTabPane>

      <NTabPane name="dall.e" tab="Dall.E/即梦AI">
        <div class="p-4">
          <aiDall />
        </div>
      </NTabPane>

      <NTabPane name="ideogram" tab="IdeoGram">
        <div class="p-2">
          <aiIdeoInput />
        </div>
      </NTabPane>

      <NTabPane v-if="isMobile" name="Close">
        <template #tab>
          <div class=" text-center flex justify-center items-center" @click="$emit('close')">
            <SvgIcon icon="ri:close-circle-line" />
          </div>
        </template>
        <div class="p-4">
          <div class=" justify-center items-center flex" @click="$emit('close')">
            <SvgIcon icon="ri:close-circle-line" /> Close By Click me
          </div>
        </div>
      </NTabPane>
    </NTabs>
  </div>
</template>
