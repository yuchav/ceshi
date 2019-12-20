/*
* @TODO =================文件说明=========================
*   用于主动的向对方链接发送请求 完成功能需求 此文件不用于account
*   ===================================================
* @note 发送数据均以send开头 获取用get(但是 一般在account文件中)
* @author iEfoam
* @time 2019-12-18 23:07
* @return mixed
* */

import request from '@/plugins/request';
import Config from '@/config';

const apiConfig = Config.apiRoute;

/*
* @object 将页面点击的按钮 传递给接口端
* @param data
* @author iEfoam
* @time 2019-12-18 23:07
* @return mixed
* */
export function send3dModelInfo (data) {
    console.log(data)
    return request({
        url: apiConfig.getCertificateByParameter.url,
        method: apiConfig.getCertificateByParameter.method,
        data
    });
}
