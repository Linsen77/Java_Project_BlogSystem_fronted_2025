import 'vuetify/styles' // 导入 Vuetify 样式
import { createVuetify } from 'vuetify' // 导入 Vuetify
import '@mdi/font/css/materialdesignicons.css'  // 引入 Material Design 图标样式

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 创建 Vuetify 实例
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'morandiLight',
        themes: {
            morandiLight: {
                dark:false,
                colors:{
                    primary: '#f2b5a0', // 柔和浅橙粉
                    secondary: '#d9a7c7', // 淡紫粉，温柔
                    accent: '#f5e6d3', // 米色，背景呼应
                    info: '#90a4ae', // 浅灰蓝，冷暖平衡
                    success: '#a5d6a7', // 柔和浅绿
                    warning: '#ffe082', // 柔黄，提示色
                    error: '#ef9a9a', // 浅红，错误提示
                    background: 'linear-gradient(135deg, #f5e6d3, #f2d7d5, #e8dcd0)', // 整体背景偏暖白
                    card: '#ffffffcc' // 半透明卡片背景
                },
            },
        },
    },
})

export default vuetify
