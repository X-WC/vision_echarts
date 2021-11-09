export default class SocketService {
  /**
   * 单例
  */
  static instance = null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务器连接的socket对象
  ws = null

  // 存储回调函数
  callBackMapping = {}

  // 标识连接是否成功
  contented = false
  // 记录重试次数
  sendRetryCount = 0
  // 重新连接尝试的次数
  connectRetryCount = 0
  // 定义连接服务器的方法
  connect () {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    // 连接成功的事件
    this.ws.onopen = () => {
      console.log('连接服务器成功')
      this.contented = true
      // 重置重连次数
      this.connectRetryCount = 0
    }
    // 连接失败的事件
    // 触发条件有两个 1.服务器关闭 2.连接失败
    this.ws.onclose = () => {
      console.log('连接服务器失败')
      this.contented = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500)
    }
    // 得到服务器发送过来的事件
    this.ws.onmessage = msg => {
      // console.log('从服务器获取到的数据' + msg)
      // 服务返回的数据
      const recvData = JSON.parse(msg.data)
      // 服务器返回数据中的 socketType 的值
      const socketType = recvData.socketType
      // 判断是否存储了此回调函数
      if (this.callBackMapping[socketType]) {
        // 服务器返回数据中的 action 的值
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          // 没看懂在干嘛
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {

        } else if (action === 'themeChange') {

        }
      }
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callback) {
    this.callBackMapping[socketType] = callback
  }

  // 取消某一个回调函数
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法
  send (data) {
    if (this.contented) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      // 延迟重试操作
      setTimeout(() => {
        this.sendRetryCount++
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
