import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'

// 使用通知提示
export function toast(title, message, type = 'success', dangerouslyUseHTMLString = false) {
  ElNotification({
    title: title,
    message: message,
    type: type,
    showClose: true,
    dangerouslyUseHTMLString,
    duration: 1000
  })
}

export function ERRORNotification(titleMsg = 'error', msg = 'error') {
  ElNotification({
    dangerouslyUseHTMLString: true,
    message: `
        <p style="color:red;bold;font-size:20px">${titleMsg}</p>
        <p style="margin-top:10px"></p>
        <p>${msg}</p>
        `
  })
}

// 使用消息提示
export function message(
  message,
  type = 'success',
  duration = 1000,
  dangerouslyUseHTMLString = false
) {
  ElMessage({
    showClose: true,
    message,
    type,
    dangerouslyUseHTMLString,
    duration,
    center: true
  })
}

export function showModal(content = '提示内容', type = 'warning', title = '') {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type
  })
}
