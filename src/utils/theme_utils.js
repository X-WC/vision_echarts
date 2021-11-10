const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题颜色
    titleColor: '#fff',
    // 左上角logo图标文件
    logoSrc: '',
    // 切换主题的图片路径
    themeSrc: 'qiehuan_dark.png',
    headerBorderSrc: 'header_border_dark.png'
  },
  vintage: {
    // 背景颜色
    backgroundColor: '#eee',
    // 标题颜色
    titleColor: '#000',
    // 左上角logo图标文件
    logoSrc: '',
    // 切换主题的图片路径
    themeSrc: 'qiehuan_light.png',
    headerBorderSrc: 'header_border_light.png'
  }
}

export function getThemeValue (themeName) {
  return theme[themeName]
}
