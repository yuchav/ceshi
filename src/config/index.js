/**
 * iView Admin Pro 开发配置
 * */

const env = process.env.NODE_ENV;

const Config = {
    // logo地址
    logo: {
        logoPath: '/assets/images/logo.jpg',
        // 由于LOGO旁边的文字是有 -- 两行 --  在此处请使用换行符(\n)分开
        logoDesc: '张家港龙亿智慧仓库\n安全管理系统'
    },
    // 请求域名设置
    apiBaseURL: env === 'development' ? 'http://localhost:8080/response' : '/',
    /**
     *  路由设置
     * */
    apiRoute: {
        login: {
            alias: '登录接口',
            url: '/login/response-success.json',
            method: 'get'
        },
        getHeaderMenu: {
            alias: '获取头部导航',
            url: '/menu/response.json',
            method: 'get'
        },
        getGoodsStored: {
            alias: '获取货物存取数据',
            url: '/货物存储/response.json',
            method: 'get'
        },
        get3dModelInfo: {
            alias: '获取-三维模型-数据',
            url: '/三维模型/response.json',
            method: 'get'
        },
        getStoredDetail: {
            alias: '获取货物存取详情的数据',
            url: '/货物存储/detail-response.json',
            method: 'get'
        },
        getTemporaryStorage: {
            alias: '获取临时存储的数据',
            url: '/临时存储/response.json',
            method: 'get'
        },
        getDistributionData: {
            alias: '获取-分布状况-的数据',
            url: '/分布状况/response.json',
            method: 'get'
        },
        getEnvironmentalMonitoring: {
            alias: '获取-环境监测-的数据',
            url: '/环境监测/response.json',
            method: 'get'
        },
        getElectricityMonitoring: {
            alias: '获取-用电监测-的数据',
            url: '/用电监测/response.json',
            method: 'get'
        },
        getElectricityRealTime: {
            alias: '获取-用电监测-实时监测-的数据',
            url: '/用电监测/实时监测/response.json',
            method: 'get'
        },
        getElectricityHistory: {
            alias: '获取-用电监测-历史数据-的数据',
            url: '/用电监测/历史数据/response.json',
            method: 'get'
        },
        getSpaceMonitoring: {
            alias: '获取-空间监测-的数据',
            url: '/空间监测/response.json',
            method: 'get'
        }

    },
    /**
     * 版权设置
     * */
    copyright: {
        copyright: ' Copyright © www.longyi.com , All Rights Reserved.',
        contact: 'Email : 1234567@qq.com   QQ: 1234567'
    }
};

module.exports = Config;