<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NInput, NSelect, useMessage } from 'naive-ui'
import { homeStore } from '@/store'
import { SvgIcon } from '@/components/common'

const ms = useMessage()
const config = ref({
  model: [
    { label: 'DALL·E 3', value: 'dall-e-3' },
    { label: '即梦AI 2.1', value: 'jimeng-2.1' },
    { label: '即梦AI 2.0 Pro', value: 'jimeng-2.0-pro' },
    { label: '即梦AI 2.0', value: 'jimeng-2.0' },
    { label: '即梦AI 1.4', value: 'jimeng-1.4' },
    { label: '即梦AI XL Pro', value: 'jimeng-xl-pro' },
    { label: 'Flux', value: 'flux' },
    { label: 'Flux-Dev', value: 'flux-dev' },
    { label: 'Flux-Pro', value: 'flux-pro' },
    { label: 'Flux.1.1-Pro', value: 'flux.1.1-pro' },
  ],
})
const st = ref({ isGo: false })
const f = ref({ size: '1024x1024', prompt: '', model: 'dall-e-3', n: 1 })
const isDisabled = computed(() => {
  if (st.value.isGo)
    return true
  if (f.value.prompt.trim() == '')
    return true
  return false
})
const create = async () => {
  // const d= await gptFetch('/v1/embeddings',{
  // "input":  f.value.prompt,
  // "model": "text-embedding-ada-002"
  // });
  // mlog('test',d );
  // return ;
  const obj = {
    action: 'gpt.dall-e-3',
    data: f.value,
  }
  homeStore.setMyData({ act: 'draw', actData: obj })
  st.value.isGo = true
}
watch(() => homeStore.myData.act, (n) => {
  if (n == 'dallReload') {
    st.value.isGo = false
    f.value.prompt = ''
  }
  if (n == 'updateChat')
    st.value.isGo = false
})

const dimensionsList = computed(() => {
  return [{
    label: '1024px*1024px',
    value: '1024x1024',
  }, {
    label: '1792px*1024px',
    value: '1792x1024',
  }, {
    label: '1024px*1792px',
    value: '1024x1792',
  },
  ]
})
watch(() => f.value.model, (n) => {
  f.value.size = '1024x1024'
})
</script>

<template>
  <section class="mb-4 flex justify-between items-center">
    <div>{{ $t('mjchat.version') }} </div>
    <NSelect v-model:value="f.model" :options="config.model" filterable tag size="small" class="!w-[70%]" :clearable="false" />
  </section>
  <section class="mb-4 flex justify-between items-center">
    <div>{{ $t('mjchat.size') }}</div>
    <NSelect v-model:value="f.size" :options="dimensionsList" filterable tag size="small" class="!w-[70%]" :clearable="false" />
  </section>
  <div class="mb-1">
    <NInput
      v-model:value="f.prompt" type="textarea" :placeholder="$t('mjchat.prompt')" round clearable maxlength="500" show-count
      :autosize="{ minRows: 3, maxRows: 10 }"
    />
  </div>

  <div class="mb-4 flex justify-end items-center">
    <div class="flex ">
      <NButton type="primary" :block="true" :disabled="isDisabled" @click="create()">
        <SvgIcon icon="mingcute:send-plane-fill" />
        {{ $t('mjchat.imgcreate') }}
      </NButton>
    </div>
  </div>

  <ul class="pt-4" v-html="$t('mjchat.dalleInfo')" />
</template>
