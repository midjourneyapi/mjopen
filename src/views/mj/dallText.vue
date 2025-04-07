<script setup lang="ts">
import { NButton, NImage } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { isDallImageModel, localGet, url2base64 } from '@/api'
import { homeStore } from '@/store'
const props = defineProps<{ chat: Chat.Chat }>()
const { isMobile } = useBasicLayout()
const st = ref({ isLoadImg: false, uri_base64: '' })
const chat = computed(() => props.chat)

const load = async () => {
  if (!isDallImageModel(chat.value.model) || !chat.value.myid || !chat.value.opt?.imageUrl) {
    st.value.isLoadImg = true
    return
  }
  const key = `dall:${chat.value.myid}`
  try {
    // 处理单张图片或多张图片
    const urls = chat.value.opt?.images || [chat.value.opt?.imageUrl]

    // 对于即梦AI图片，直接设置 isLoadImg 为 true
    if (urls.some(url => url.includes('byteimg.com'))) {
      st.value.isLoadImg = true
      return
    }

    // 对于其他图片，使用代理处理
    for (const url of urls) {
      let base64 = await localGet(key)
      if (!base64) {
        const ubase64 = await url2base64(`https://wsrv.nl/?url=${encodeURIComponent(url)}`, key)
        base64 = ubase64.base64 as string
      }
      st.value.uri_base64 = base64 as string
    }
  }
  catch (error) {
    // 图片保存失败
  }

  st.value.isLoadImg = true
}

// 监听 chat.opt 的变化
watch(() => chat.value.opt, (newOpt) => {
  if (newOpt && (newOpt.imageUrl || newOpt.images?.length))
    load()
}, { immediate: true })

watch(() => homeStore.myData.act, (n) => {
  const actData: any = homeStore.myData.actData

  if (n === 'dallReload' && actData.myid === chat.value.myid) {
    st.value.isLoadImg = false
    load()
  }
})

load()
</script>

<template>
  <div>
    <div v-if="st.isLoadImg">
      <div class="flex flex-wrap gap-2">
        <template v-if="chat.opt?.images?.length">
          <NImage
            v-for="(url, index) in chat.opt.images"
            :key="index"
            :src="url"
            class="rounded-sm"
            :class="[isMobile ? '' : '!max-w-[500px]']"
          />
        </template>
        <template v-else-if="chat.opt?.imageUrl">
          <NImage
            :src="chat.opt.imageUrl"
            class="rounded-sm"
            :class="[isMobile ? '' : '!max-w-[500px]']"
          />
        </template>
      </div>
    </div>
    <div v-else-if="chat.opt?.imageUrl || chat.opt?.images?.length" class="w-[200px] h-[150px] flex flex-col justify-center items-center">
      <div class="p-4">
        {{ $t('mjchat.loading') }}
      </div>
      <NButton type="primary">
        <a :href="chat.opt?.imageUrl || chat.opt?.images?.[0]" target="_blank">{{ $t('mjchat.openurl') }}</a>
      </NButton>
    </div>
  </div>
</template>
