<script setup lang="ts">
import { NButton, NInput, NSwitch, useMessage } from 'naive-ui' // NInfiniteScroll

import { watch } from 'vue'
import { gptServerStore } from '@/store'
import { blurClean } from '@/api'
import { t } from '@/locales'

const emit = defineEmits(['close'])
const ms = useMessage()
const save = () => {
  gptServerStore.setMyData(gptServerStore.myData)
  ms.success(t('mjchat.success'))
  emit('close')
}
// const blurClean= ()=>{
//   mlog('blurClean');
//   gptServerStore.myData.OPENAI_API_BASE_URL =myTrim( myTrim(gptServerStore.myData.OPENAI_API_BASE_URL.trim(),'/'), '\\' );
//   gptServerStore.myData.OPENAI_API_KEY = gptServerStore.myData.OPENAI_API_KEY.trim();
//   gptServerStore.myData.MJ_SERVER =myTrim( myTrim( gptServerStore.myData.MJ_SERVER.trim(),'/'),'\\');
//   gptServerStore.myData.MJ_API_SECRET = gptServerStore.myData.MJ_API_SECRET.trim();
//   gptServerStore.myData.UPLOADER_URL=  myTrim( myTrim( gptServerStore.myData.UPLOADER_URL.trim(),'/'),'\\');
// }

// const isSync= computed(()=>gptServerStore.myData.IS_SET_SYNC )
watch(() => gptServerStore.myData.OPENAI_API_BASE_URL, (n) => {
  if (!gptServerStore.myData.IS_SET_SYNC)
    return
  gptServerStore.myData.MJ_SERVER = n
  gptServerStore.myData.SUNO_SERVER = n
  gptServerStore.myData.LUMA_SERVER = n
  gptServerStore.myData.VIGGLE_SERVER = n
  gptServerStore.myData.RUNWAY_SERVER = n
  gptServerStore.myData.IDEO_SERVER = n
  gptServerStore.myData.KLING_SERVER = n
  gptServerStore.myData.PIKA_SERVER = n
  gptServerStore.myData.PIXVERSE_SERVER = n
  gptServerStore.myData.UDIO_SERVER = n
})
watch(() => gptServerStore.myData.OPENAI_API_KEY, (n) => {
  if (!gptServerStore.myData.IS_SET_SYNC)
    return
  gptServerStore.myData.MJ_API_SECRET = n
  gptServerStore.myData.SUNO_KEY = n
  gptServerStore.myData.LUMA_KEY = n
  gptServerStore.myData.VIGGLE_KEY = n
  gptServerStore.myData.RUNWAY_KEY = n
  gptServerStore.myData.IDEO_KEY = n
  gptServerStore.myData.KLING_KEY = n
  gptServerStore.myData.PIKA_KEY = n
  gptServerStore.myData.PIXVERSE_KEY = n
  gptServerStore.myData.UDIO_KEY = n
})
</script>

<template>
  <div id="setserver">
    <div class="w-full h-[540px] overflow-y-auto overflow-x-hidden">
      <div class="p-2">
        <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
          <p v-html="$t('mj.setKeyTip')" />
        </div>
        <div class="flex justify-between items-baseline ">
          <div class="pb-1">
            <NSwitch v-model:value="gptServerStore.myData.IS_SET_SYNC" size="small">
              <template #checked>
                {{ $t('mjchat.setSync') }}
              </template>
              <template #unchecked>
                {{ $t('mjchat.setSync') }}
              </template>
            </NSwitch>
          </div>
          <div class="text-right">
            {{ $t('mj.setOpen') }}
          </div>
        </div>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.OPENAI_API_BASE_URL" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.setOpenUrl') }}:</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.OPENAI_API_KEY" type="password" :placeholder="$t('mj.setOpenKeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">OpenAI Api Key:</span>
            </template>
          </NInput>
        </section>

        <div class="flex justify-between items-baseline ">
          <section class="mb-4 flex justify-start items-center">
            <NSwitch v-model:value="gptServerStore.myData.GPTS_GX">
              <template #checked>
                {{ $t('mj.gpt_gx') }}
              </template>
              <template #unchecked>
                {{ $t('mj.gpt_gx') }}
              </template>
            </NSwitch>
          </section>
          <section class="mb-4 flex justify-start items-center">
            <NSwitch v-model:value="gptServerStore.myData.MJ_CDN_WSRV">
              <template #checked>
                {{ $t('mj.wsrvClose') }}
              </template>
              <template #unchecked>
                {{ $t('mj.wsrvOpen') }}
              </template>
            </NSwitch>
          </section>
        </div>

        <div class="text-right">
          {{ $t('mj.setMj') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.MJ_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable>
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.setMjUrl') }}</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.MJ_API_SECRET" type="password" :placeholder="$t('mj.setMjKeyPlaceholder') " show-password-on="click" clearable>
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Midjourney Api Secret:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('suno.serverabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.SUNO_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('suno.server') }}:</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.SUNO_KEY" type="password" :placeholder="$t('suno.setOpenKeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Suno Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('video.lumaabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.LUMA_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('video.lumaserver') }}:</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.LUMA_KEY" type="password" :placeholder="$t('video.setOpenKeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Luma Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('dance.viggleabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.VIGGLE_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('dance.viggleserver') }}:</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.VIGGLE_KEY" type="password" :placeholder="$t('dance.setOpenKeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Viggle Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('video.runwayabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.RUNWAY_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('video.runwayserver') }}:</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.RUNWAY_KEY" type="password" :placeholder="$t('video.setOpenKeyPlaceholder2')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Runway Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('mj.ideoabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.IDEO_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.ideoserver') }}:</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.IDEO_KEY" type="password" :placeholder="$t('mj.ideokeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Ideogram Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('mj.klingabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.KLING_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.klingserver') }}:</span>
            </template>
          </NInput>
        </section>

        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.KLING_KEY" type="password" :placeholder="$t('mj.klingkeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.klingkey') }}:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('mj.pikaabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.PIKA_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.pikaserver') }}:</span>
            </template>
          </NInput>
        </section>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.PIKA_KEY" type="password" :placeholder="$t('mj.pikakeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Pika Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('mj.udioabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.UDIO_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.udioserver') }}:</span>
            </template>
          </NInput>
        </section>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.UDIO_KEY" type="password" :placeholder="$t('mj.udiokeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Udio Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('mj.pixabout') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.PIXVERSE_SERVER" :placeholder="$t('mj.setOpenPlaceholder') " clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.pixserver') }}:</span>
            </template>
          </NInput>
        </section>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.PIXVERSE_KEY" type="password" :placeholder="$t('mj.pixkeyPlaceholder')" show-password-on="click" clearable @blur="blurClean">
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">Pixverse Key:</span>
            </template>
          </NInput>
        </section>

        <div class="text-right">
          {{ $t('mj.setUploader') }}
        </div>
        <section class="mb-4 flex justify-between items-center">
          <NInput v-model:value="gptServerStore.myData.UPLOADER_URL" :placeholder="$t('mj.setOpenPlaceholder')" clearable>
            <template #prefix>
              <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.setUploaderUrl') }}</span>
            </template>
          </NInput>
        </section>
      </div>
    </div>

    <section class=" text-right flex justify-end space-x-2">
      <NButton @click="gptServerStore.setInit()">
        {{ $t('mj.setBtBack') }}
      </NButton>
      <NButton type="primary" @click="save">
        {{ $t('mj.setBtSave') }}
      </NButton>
    </section>
  </div>
</template>

<style>
#setserver .n-input .n-input__input-el{
    text-align: right;
}
</style>
