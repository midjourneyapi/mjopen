// import { useChat } from '@/views/chat/hooks/useChat'

import { localGet, localSaveAny } from './mjsave'
import { gptServerStore, homeStore, useAuthStore } from '@/store'
import { copyToClip } from '@/utils/copy'
import { t } from '@/locales'
// import { useMessage } from "naive-ui";
export interface gptsType {
  gid: string
  name: string
  logo: string
  info: string
  use_cnt?: string
  bad?: string | number
}
// const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
export function upImg(file: any): Promise<any> {
  const maxSize = homeStore.myData.session.uploadImgSize ? (+homeStore.myData.session.uploadImgSize) : 1
  return new Promise((resolve, reject) => {
    const filename = file.name
    if (file.size > (1024 * 1024 * maxSize)) {
      reject(t('mjchat.no1m', { m: maxSize }))
      return
    }
    if (!(filename.endsWith('.jpg')
            || filename.endsWith('.gif')
            || filename.endsWith('.png')
            || filename.endsWith('.jpeg'))) {
      reject(t('mjchat.imgExt'))
      return
    }
    const reader = new FileReader()
    reader.onload = (e: any) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

export const clearImageBase64 = (str: string) => {
  const arr = str.split('base64,', 2)
  return arr[1] ?? arr[0]
}

export const file2blob = (selectedFile: any) => {
  return new Promise<{ blob: Blob;filename: string }>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (event: any) {
      // 将文件内容转换为 Blob
      const blob = new Blob([event.target.result], { type: selectedFile.type })

      // 在这里可以使用生成的 Blob 对象
      // console.log(blob);
      resolve({ blob, filename: selectedFile.name })
    }
    reader.onerror = e => reject(e)

    // 开始读取文件
    reader.readAsArrayBuffer(selectedFile)
  })
}

export const blob2file = (blob: Blob, fileName: string) => {
  const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() })
  return file
}

export const isFileMp3 = (filename: string) => {
  const arr = '.mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm'.split(/[, ]+/ig)
  filename = filename.toLocaleLowerCase()
  for (const ext of arr) {
    if (filename.endsWith(ext))
      return true
  }
  return false
}

function containsChinese(str: string) {
  return false // 11.18 都不需要翻译
//   var reg = /[\u4e00-\u9fa5]/g; // 匹配中文的正则表达式
//   return reg.test(str);
}

export async function train(text: string) {
  return new Promise<string>((resolve, reject) => {
    if (text.trim() == '') {
      reject(t('mjchat.placeInput'))
      return
    }

    if (!containsChinese(text.trim())) {
      resolve(text.trim())
      return
    }

    // myTranslate( text.trim())
    //     .then((d:any)=>  resolve( d.content.replace(/[?.!]+$/, "")))
    //     .catch(( )=>   reject('翻译发生错误'))
    resolve(text.trim())
  })
}

export const myTrim = (str: string, delimiter: string) => {
  // 构建正则表达式，使用动态的定界符
  const regex = new RegExp(`^${delimiter}+|${delimiter}+$`, 'g')

  // 使用正则表达式去除字符串两端的定界符
  return str.replace(regex, '')
}

function getHeaderApiSecret() {
  if (!gptServerStore.myData.MJ_API_SECRET) {
    const authStore = useAuthStore()
    if (authStore.token)
      return { 'x-ptoken': authStore.token }
    return {}
  }
  return {
    'mj-api-secret': gptServerStore.myData.MJ_API_SECRET,
  }
}

const getUrl = (url: string) => {
  if (url.indexOf('http') === 0)
    return url
  if (gptServerStore.myData.MJ_SERVER)
    return `${gptServerStore.myData.MJ_SERVER}${url}`
  return `/mjapi${url}`
}

export const mjFetch = (url: string, data?: any) => {
  let header = { 'Content-Type': 'application/json' }
  header = { ...header, ...getHeaderApiSecret() }

  return new Promise<any>((resolve, reject) => {
    const opt: RequestInit = { method: 'GET' }
    opt.headers = header
    if (data) {
      opt.body = JSON.stringify(data)
      opt.method = 'POST'
    }
    fetch(getUrl(url), opt)
      .then(d2 => d2.json().then((d) => {
        if (d2.ok)
          resolve(d)
        else
          reject(new Error(d.error ?? (d ?? 'Network response was not ok!')))
      }).catch(e => reject(new Error(e ? e.toString() : 'json_error'))),
      ).catch(e => reject(new Error(e ? e.toString() : 'fetch fail')))
  })
}

export const myFetch = (url: string, data?: any) => {
  const header = { 'Content-Type': 'application/json' }

  return new Promise<any>((resolve, reject) => {
    const opt: RequestInit = { method: 'GET' }
    opt.headers = header
    if (data) {
      opt.body = JSON.stringify(data)
      opt.method = 'POST'
    }
    fetch(getUrl(url), opt)
      .then(d => d.json().then(d => resolve(d))
        .catch(e => reject(e)))
      .catch(e => reject(e))
  })
}

export const my2Fetch = (url: string, data?: any) => {
  const header = { 'Content-Type': 'application/json' }

  return new Promise<any>((resolve, reject) => {
    const opt: RequestInit = { method: 'GET' }
    opt.headers = header
    if (data) {
      opt.body = JSON.stringify(data)
      opt.method = 'POST'
    }
    fetch((url), opt)
      .then(d => d.json().then(d => resolve(d))
        .catch(e => reject(e)))
      .catch(e => reject(e))
  })
}

export const flechTask = (chat: Chat.Chat) => {
  let cnt = 0
  const check = async () => {
    cnt++
    if (!chat.mjID) {
      chat.text += '\n获取失败'
      chat.loading = false
      homeStore.setMyData({ act: 'updateTask', actData: chat })
      return
    }
    const ts = await mjFetch(`/mj/task/${chat.mjID}/fetch`)
    chat.opt = ts
    chat.loading = !((cnt >= 99))

    if (ts.progress && ts.progress === '100%')
      chat.loading = false

    homeStore.setMyData({ act: 'updateChat', actData: chat })
    if (!['FAILURE', 'SUCCESS'].includes(ts.status) && cnt < 100)
      setTimeout(() => check(), 5000)
  }
  check()
}

export const subTask = async (data: any, chat: Chat.Chat) => {
  let d: any
  try {
    if (data.action && data.action === 'change') {
      d = await mjFetch('/mj/submit/change', data.data)
    }
    else if (data.action && data.action === 'CustomZoom') {
      d = await mjFetch('/mj/submit/action', data.data)
      if (d.result) {
        const bdata = data.maskData
        bdata.taskId = d.result
        d = await mjFetch('/mj/submit/modal', bdata)
      }
    }
    else if (data.action && data.action === 'mask') {
      d = await mjFetch('/mj/submit/action', data.data)
      if (d.result) {
        const bdata = data.maskData
        bdata.taskId = d.result
        d = await mjFetch('/mj/submit/modal', bdata)
      }
    }
    else if (data.action && data.action === 'blend') {
      d = await mjFetch('/mj/submit/blend', data.data)
    }
    else if (data.action && data.action === 'shorten') {
      d = await mjFetch('/mj/submit/shorten', data.data)
    }
    else if (data.action && data.action === 'face') {
      d = await mjFetch('/mj/insight-face/swap', data.data)
    }
    else if (data.action && data.action === 'img2txt') {
      d = await mjFetch('/mj/submit/describe', data.data)
    }
    else if (data.action && data.action === 'changeV2') {
      d = await mjFetch('/mj/submit/action', data.data)
      if (d.description && d.description.includes('confirm'))
        d = await mjFetch('/mj/submit/modal', { taskId: d.result, prompt: d.properties.finalPrompt ?? '' })
    }
    else {
      const toData = {
        base64Array: data.fileBase64 ?? [],
        notifyHook: '',
        prompt: data.drawText,
        state: '',
        botType: 'MID_JOURNEY',
      }
      if (data.bot && data.bot === 'NIJI_JOURNEY')
        toData.botType = data.bot

      d = await mjFetch('/mj/submit/imagine', toData)
    }
    if (d.code === 21)
      d = await mjFetch('/mj/submit/modal', { taskId: d.result })

    backOpt(d, chat)
  }
  catch (e: any) {
    chat.text = '失败！' + `\n\`\`\`json\n${JSON.stringify(e, null, 2)}\n\`\`\`\n`
    chat.loading = false
    homeStore.setMyData({ act: 'updateChat', actData: chat })
  }
}

const backOpt = (d: any, chat: Chat.Chat) => {
  if (d.code == 1 || d.code == 22) {
    chat.text = d.code == 22 ? d.description : '提交成功！'
    chat.mjID = d.result
    flechTask(chat)
    chat.loading = true
    homeStore.setMyData({ act: 'updateChat', actData: chat })
    // chat.m= d.result;
  }
  else {
    chat.text = '失败！' + `\n\`\`\`json\n${JSON.stringify(d, null, 2)}\n\`\`\`\n`
    chat.loading = false
    homeStore.setMyData({ act: 'updateChat', actData: chat })
  }
}

export const mjSeed = async (mjid: string) => {
  const ts = await mjFetch(`/mj/task/${mjid}/image-seed`)
  return ts
}

export const getSeed = async (cchat: Chat.Chat, message: any) => {
  // const message = useMessage();
  // let cchat = props.chat;
  if (!cchat.mjID)
    return
  let seed = 0
  if (cchat.opt?.seed) { seed = cchat.opt?.seed }
  else {
    try {
      message.info('获取中...')
      const res: any = await mjSeed(cchat.mjID)
      seed = res.result
      if (seed > 0) {
        if (cchat.opt) {
          cchat.opt.seed = seed

          homeStore.setMyData({ act: 'updateChat', actData: cchat })
        }
        message.success('获取成功')
      }
    }
    catch (e) {
      message.error('获取失败')
    }
  }
  if (seed > 0) {
    await copyToClip(`${seed}`)
    message.success('复制seed成功')
  }
}

export const getLastVersion = async () => {
  const url = 'https://api.github.com/repos/Dooy/chatgpt-web-midjourney-proxy/tags?per_page=1'
  const a = await myFetch(url)
  return a
}

export const canVisionModel = (model: string) => {
  if (['gpt-4-all', 'gpt-4-v', 'gpt-4v', 'gpt-3.5-net', 'gpt-4o-all'].includes(model))
    return true
  if (model.includes('-all'))
    return true // 各种all模型
  if (model.includes('gpt-4-gizmo'))
    return true // || model.indexOf('claude-3-opus')>-1cha

  return false
}
export const isCanBase64Model = (model: string) => {
  // gpt-4o
  // customVisionModel
  const arr = ['gpt-4o', 'gemini', '1.5', 'sonnet', 'opus', 'deepseek']
  for (const m of arr) {
    if (model.includes(m))
      return true
  }
  if (model.includes('gpt-4o') || (model.includes('gemini') && model.includes('1.5')))
    return true

  // if(model.indexOf('sonnet')>-1 ) return true ;
  const visionArr = ['gemini-pro-vision', 'gpt-4o-2024-08-06', 'gpt-4o-2024-11-20', 'gpt-4o', 'gpt-4o-2024-05-13', 'gpt-4o-mini', 'gpt-4o-mini-2024-07-18', 'gemini-pro-1.5', 'gpt-4-turbo', 'gpt-4-turbo-2024-04-09', 'gpt-4-vision-preview', 'luma-video', 'claude-3-5-sonnet-20240620', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229', defaultVisionModel()]
  if (homeStore.myData.session.customVisionModel) {
    homeStore.myData.session.customVisionModel.split(/[ ,]+/ig).map((v: string) => {
      visionArr.push(v.toLocaleLowerCase())
    })
  }
  return visionArr.includes(model)
}
export const canBase64Model = (model: string) => {
  if (isCanBase64Model(model))
    return model
  return defaultVisionModel()
}

export const defaultVisionModel = () => {
  if (homeStore.myData.session && homeStore.myData.session.visionModel)
    return homeStore.myData.session.visionModel

  return 'gpt-4-vision-preview'
}

export const isTTS = (model: string) => {
  if (model.indexOf('tts-1') === 0)
    return true
  return false
}

function isStringOnlyDigits(input: string): boolean {
  // 使用正则表达式检查字符串是否只包含数字
  const regex = /^[0-9]+$/
  return regex.test(input)
}
export const loadGallery = async () => {
  const localKey = 'mj-list-condition'
  const d2: any = await localGet(localKey)
  if (d2 && (Date.now() - d2.ctime) < 300 * 1000)
    return d2.d as any[]

  let d = await mjFetch('/mj/gallery')
  if (!d.data.list || d.data.list.length == 0)
    return []
  const list = d.data.list as any[]
  const ids = list.filter(v => isStringOnlyDigits(v.reqid)).map(v => +v.reqid)
  if (ids.length == 0)
    return []
  d = await mjFetch('/mj/task/list-by-condition', { ids })

  if (d.length > 0)
    localSaveAny({ ctime: Date.now(), d }, localKey)
  return d as any[]
}

// 从剪贴板中读取文件
export function getFileFromClipboard(event: any) {
  const rz = []
  if (event.clipboardData || event.originalEvent) {
    const clipboardData = (event.clipboardData || event.originalEvent.clipboardData)
    if (clipboardData.items) {
      const items = clipboardData.items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.includes('image') || items[i].kind === 'file')
          rz.push(items[i].getAsFile())
      }
    }
  }
  return rz
}

// 修改为空函数
export const mlog = (_msg: string, ..._args: unknown[]) => {
  // 空函数，不执行任何操作
}
