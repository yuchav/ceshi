<template>
    <main class="body-content-main">
        <div class="content-layout-left" :class="{ 'i-layout-slider-min': this.menuCollapse }"
             ref="left">
            <div class="logo-words-desc"> {{ logoDesc }} </div>
            <Card :bordered="false" class="i-admin-left-menu">
                <Card :title="title" icon="ios-options"  shadow >
                    <div class="ivu-block"
                            v-for="(item, key) in menuList" :key="key">
                        <h4>{{ item.groupName }}</h4>
                        <div class="ivu-block">
                            <div class="regime-btn ivu-btn ivu-btn-default ivu-font-size-small"
                                 v-for="(value, index) in item.children"
                                 :key="index"
                                 :class="{ 'ivu-btn-selected': btnArr[key][index]['state'] }"
                                 @click="selectThisBtn(key, index)">
                                <div class="ivu-inline-block">{{ value.title }}</div>
                                <div class="ivu-inline-block do-action-btn">
                                    <Icon type="ios-add-circle" size="18" @click.stop="modalAction(1, '', key)"/>
                                    <Icon type="ios-close-circle" size="18" @click.stop="modalAction(3, value.id, key, index)"/>
                                    <Icon type="md-create" size="18" @click.stop="modalAction(2, value, key, index)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="chartLineBox" style="width: 95%;height: 30vh; margin-top: 30px;" class="ivu-inline-block"> </div>
                </Card>
            </Card>
        </div>
        <div class="content-layout-right user-full-img ivu-overflow-auto"
             :class="{ 'content-layout-right-pro': this.menuCollapse }"
             ref="right">
            <div class="ivu-block ">
                <Form :model="formItem" :label-width="70"  inline :label-colon="true"
                      class="real-time-form ivu-inline-block user-full-screen">
                    <div class="ivu-form-item" style="line-height: 32px;">
                        功能操作
                    </div>
                    <FormItem label="输入搜索">
                        <Input v-model="formItem.input" placeholder="文件名/序号/..." size="small"
                               style="width: 180px" />
                    </FormItem>
                    <FormItem label="临期时间">
                        <Select v-model="formItem.periodTime" size="small"
                                class="ivu-nomal-select"
                                style="width:180px">
                            <Option value="10">临期10天</Option>
                            <Option value="20">临期20天</Option>
                            <Option value="30">临期30天</Option>
                        </Select>
                        <Button type="primary" size="small" @click="reloadTable"
                                class="ivu-ml-40 ivu-query-btn">查询结果</Button>
                        <Button size="small" @click="reloadTable(false)" class="ivu-ml">重置查询</Button>
                        <Button size="small" @click="modalTable(1)" class="ivu-ml">添加</Button>
                    </FormItem>
                    <div class="ivu-inline-block ivu-form-item ivu-no-lable" style="float: right">
                        <Select v-model="formItem.pageSize" size="small"
                                placeholder="显示条数"
                                @on-change="reloadTable" style="width: 110px;margin-top: 4px;">
                            <Option value="20">20条/页</Option>
                            <Option value="50">50条/页</Option>
                            <Option value="100">100条/页</Option>
                        </Select>
                        <Select v-model="formItem.sortWay" size="small"
                                placeholder="排序方式"
                                @on-change="reloadTable"
                                style="width: 110px;margin-left: 10px; margin-top: 4px;">
                            <Option :value="item.key"
                                    v-for="(item, key) in table.columns"
                                    v-if="key < (table.columns.length - 1)"
                                    :key="key">{{ item.title }}</Option>
                        </Select>
                    </div>
                </Form>
                <Table border :columns="table.columns" :data="table.data" :loading="table.loading" class="ivu-mt">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="modalTable(4, row)">预览</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" @click.native="download(row.file_url)">下载</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" @click="modalTable(2, row)">编辑</Button>
                        <Button type="error" size="small" @click="modalTable(3, row)">删除</Button>
                    </template>
                </Table>
                <div class="ivu-block" style="float: right;margin-top: 30px;">
                    <Page :total="total" :loading="loading" :page-size="pageSize"
                          show-total show-elevator size="small"
                          @on-change="reloadTable(true, $event)"/>
                </div>
            </div>
        </div>
        <Modal
                v-model="modal.modal1.status"
                :title="modal.modal1.title"
                @on-ok="submit">
            <div class="ivu-block ivu-p-8">
                <div v-if="modal.modal1.state === 3">
                    <div style="text-align:center">
                        <p>删除当前类别会丢失所有表单数据,是否继续?</p>
                    </div>
                </div>
                <Form :model="modal.modal1" :label-width="80" :label-colon="true" :hide-required-mark="false" v-else>
                    <FormItem label="类别名"   :rules="{required: true, message: '请输入类名', trigger: 'blur'}">
                        <Input v-model="modal.modal1.input" placeholder="输入别名..."></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
        <Modal
                :width="modal.modal2.state === 3?350:900"
                v-model="modal.modal2.status"
                :title="modal.modal2.title"
                @on-ok="tableSubmit">
            <div class="ivu-block ivu-p-8">
                <div v-if="modal.modal2.state === 3">
                    <div style="text-align:center">
                        <p>删除当前行会丢失所有数据记录,是否继续?</p>
                    </div>
                </div>
                <Form :model="modal" :label-width="120" :label-colon="true"
                      :hide-required-mark="false"
                      :show-message="false"
                      style="width: 880px;margin-right: auto;margin-left: auto;" v-else>
                    <FormItem
                            class="item-copy"
                            v-for="(item, index) in formDynamic.items"
                            :key="index"
                            :label="item.label">
                            <DatePicker  v-model="item.value" type="date"
                                         v-if="item.isTime"
                                         style="width: 276px"
                                         :disabled="modal.modal2.state === 4"
                                         :placeholder="'请选择' + item.label + '...'">
                            </DatePicker>
                            <Input type="text" v-model="item.value"
                                   :disabled="modal.modal2.state === 4"
                                   :placeholder="'请输入' + item.label + '...'" v-else></Input>
                    </FormItem>
                    <FormItem label="上传选择器"
                              class="item-copy"
                              v-if="modal.modal2.state !== 4"
                              :rules="{required: true, message: '文件必须!', trigger: 'blur'}">
                        <Upload action="//jsonplaceholder.typicode.com/posts/"
                                :on-success="uploadSuccess"
                                @on-error="uploadFailed"

                                ref="uploadEle">
                            <Button icon="ios-cloud-upload-outline">选择上传文件</Button>
                            <span class="ivu-block upload-notice">只能上传word/pdf/视频格式文件，文件不能超过500Mb</span>
                        </Upload>
                    </FormItem>
                    <FormItem label="图片详情"
                              class="item-copy"
                              v-else>
                            <img :src="modal.modal2.fileInfo" alt="">
                    </FormItem>
                    <div style="clear: both"></div>
                </Form>
            </div>
        </Modal>
    </main>
</template>
<script>
    import { mapState } from 'vuex';
    import {
        getCertificateManagement, getCertificateByParameter,
        sendCertificateAction,
        sendCertificateManagement
    } from '@api';
    import Config from '@/config';
    const echarts = require('echarts');

    export default {
        name: 'dashboard-regime-management',
        data () {
            return {
                logoDesc: Config.logo.logoDesc,
                title: '证书管理',
                modelImg: '/assets/images/vbg.png',
                menuList: [],
                modal: {
                    modal1: {
                        status: false,
                        title: '添加一个类别',
                        input: '',
                        key: 0, // 父级的索引
                        index: 0, // 自身的索引
                        state: 1
                    },
                    modal2: {
                        categoryList: [], // 所有的分类
                        fileTypeList: [], // 所有的文件类型
                        status: false,
                        state: 1,
                        title: '添加文件',
                        id: undefined,
                        fileName: '',
                        category: '',
                        fileType: '',
                        fileInfo: '' // 返回id 还是路劲
                    }
                },
                btnArr: [],
                pageSize: 10,
                total: 12,
                loading: false,
                formItem: {
                    input: undefined,
                    periodTime: undefined,
                    pageSize: 10,
                    page: 1,
                    sortWay: undefined
                },
                table: {
                    // 页面系显示的表头 默认是NULL 需要用户传过来
                    columns: [],
                    data: [],
                    loading: false
                },
                // 动态的 添加表格
                formDynamic: {
                    items: []
                }
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'isMobile',
                'isTablet',
                'isDesktop',
                'screenHeight',
                'menuCollapse'
            ])
        },
        created () {
            this.table.column = this.table.columns
            getCertificateManagement().then(async res => {
                this.menuList = res.menu
                this.drawPieChart('chartLineBox', res.echartsData.legend, res.echartsData.data)
                this.setMenuClass(res.menu)
            })
        },
        mounted () {
            // 设置屏幕的宽度高度
            this.$refs.right.style.height = this.screenHeight + 'px'
            this.$refs.left.style.height = this.screenHeight + 'px'
        },
        methods: {
            selectThisBtn (key, index) {
                // 点击按钮切换颜色
                this.btnArr.some((item, key, arr) => {
                    item.some((v, i, arr) => {
                        this.btnArr[key][i].state = false
                    })
                })
                this.btnArr[key][index].state = true
                // todo 更换右侧表单的数据
                this.table.loading = true
                let id = this.menuList[key].children[index].id
                let param = {
                    groupId: this.menuList[key]['id'],
                    menuId: id
                }
                this.getCertificateTableByParam(param)
            },
            submit () {
                let param
                if (this.modal.modal1.state === 1) {
                    // TODO 异步后台添加
                    param = {
                        action: 'insert'
                    }
                    sendCertificateManagement(param).then(async res => {
                        if (res.state === true) {
                            let key = this.modal.modal1.key
                            this.menuList[key].children.push({
                                id: res.id,
                                title: this.modal.modal1.input
                            })
                            this.btnArr[key].push({
                                state: false
                            })
                        }
                        this.$Message.success(res.msg);
                    })
                } else if (this.modal.modal1.state === 2) {
                    param = {
                        action: 'update',
                        id: this.modal.modal1.id,
                        title: this.modal.modal1.input
                    }
                    sendCertificateManagement(param).then(async res => {
                        if (res.state === true) {
                            let key = this.modal.modal1.key
                            let index = this.modal.modal1.index
                            this.menuList[key].children[index].title = this.modal.modal1.input
                        }
                        this.$Message.success(res.msg);
                    })
                } else {
                    param = {
                        action: 'delete',
                        id: this.modal.modal1.id
                    }
                    sendCertificateManagement(param).then(async res => {
                        let key = this.modal.modal1.key
                        let index = this.modal.modal1.index
                        this.menuList[key].children.splice(index, 1)
                        // 清除按钮里面对应的数据
                        this.btnArr[key].splice(index, 1)
                        this.$Message.success(res.msg)
                    })
                }
            },
            modalAction (state, temp, key = 0, index = 0) {
                // 操作显示不同的模态框
                if (state === 1) {
                    // add
                    this.modal.modal1.title = '添加类别'
                    this.modal.modal1.state = 1
                    this.modal.modal1.input = ''
                    this.modal.modal1.key = key
                } else if (state === 2) {
                    // edit
                    this.modal.modal1.title = '编辑类别'
                    this.modal.modal1.state = 2
                    this.modal.modal1.input = temp.title
                    this.modal.modal1.id = temp.id
                    this.modal.modal1.key = key
                    this.modal.modal1.index = index
                } else {
                    // delete
                    // TODO 此处已经传入了id 根据id删除
                    this.modal.modal1.id = temp
                    this.modal.modal1.title = '删除类别?'
                    this.modal.modal1.state = 3
                    this.modal.modal1.key = key
                    this.modal.modal1.index = index
                }
                this.modal.modal1.status = true
            },
            setMenuClass (data) {
                let tempArr = []
                data.some((item, key, arr) => {
                    tempArr.push([])
                    item.children.some((value, index, a) => {
                        if (key === 0 && index === 0) {
                            // 默认第一个选中
                            let param = {
                                groupId: item.id,
                                menuId: value.id,
                                isFirst: true
                            }
                            this.getCertificateTableByParam(param)
                            tempArr[key].push({
                                state: true
                            })
                        } else {
                            tempArr[key].push({
                                state: false
                            })
                        }
                    })
                })
                this.btnArr = tempArr
            },
            reloadTable (state = true, event) {
                if (state) {
                    this.formItem.page = event === undefined ? 1 : event
                    this.pageSize = parseInt(this.formItem.pageSize);
                } else {
                    this.formItem = {
                        input: undefined,
                        periodTime: undefined,
                        pageSize: 10,
                        page: 1,
                        sortWay: undefined
                    }
                }
                this.getCertificateTableByParam(this.formItem)
            },
            getCertificateTableByParam (param) {
                this.table.loading = true
                console.log('param', param)
                getCertificateByParameter(param).then(async res => {
                    this.table.data = res.table.data
                    this.total = res.table.total
                    this.table.loading = false
                    res.table.columns.push({
                        title: '附件',
                        width: '250',
                        fixed: 'right',
                        align: 'center',
                        slot: 'action',
                        key: 'attachment'
                    })
                    this.table.columns = res.table.columns
                    this.table.loading = false
                })
            },
            modalTable (state, temp) {
                // 右侧的表格 操作添加和编辑模态框
                if (state === 1) {
                    // 添加 操作
                    // 获取所有该写如的字段
                    this.setModalFormItem()
                    this.modal.modal2.title = '添加文件'
                    this.modal.modal2.state = 1
                } else if (state === 2) {
                    // 编辑
                    this.setModalFormItem(temp)
                    this.modal.modal2.title = '编辑文件'
                    this.modal.modal2.state = 2
                } else if (state === 3) {
                    this.modal.modal2.title = '删除当前行数据?'
                    this.modal.modal2.state = 3
                    this.modal.modal2.id = temp.id
                } else if (state === 4) {
                    this.setModalFormItem(temp)
                    this.modal.modal2.title = '数据详情预览'
                    this.modal.modal2.state = 4
                }
                this.modal.modal2.status = true
            },
            tableSubmit () {
                let param
                if (this.modal.modal2.state === 1) {
                    param = this.formDynamic.items
                    sendCertificateAction(param).then(async res => {
                        this.$Message.success(res.msg);
                    })
                } else if (this.modal.modal2.state === 2) {
                    param = this.formDynamic.items
                    sendCertificateAction(param).then(async res => {
                        this.$Message.success(res.msg);
                    })
                } else if (this.modal.modal2.state === 3) {
                    param = {
                        action: 'delete',
                        id: this.modal.modal2.id
                    }
                    sendCertificateAction(param).then(async res => {
                        this.$Message.success(res.msg);
                    })
                }
            },
            uploadSuccess (response, file, fileList) {
                this.modal.modal2.fileInfo = response.id
                this.$Message.success('文件上传成功!');
            },
            uploadFailed (response, file, fileList) {
                console.log(response, file, fileList)
                // TODO 上传失败之后需要处理
                this.$refs.uploadEle.clearFiles()
                this.$Message.error('文件上传失败!');
            },
            setModalFormItem (data = []) {
                let form = []
                let columns = this.table.columns
                for (let i = 1; i < (columns.length - 1); i++) {
                    let formItem = {
                        label: columns[i].title,
                        name: columns[i].key,
                        value: undefined
                    }
                    if (data) {
                        Object.assign(formItem, {
                            value: data[columns[i].key]
                        })
                    }
                    if (columns[i].title.indexOf('时间') !== -1 || columns[i].title.indexOf('日期') !== -1) {
                        Object.assign(formItem, {
                            isTime: true
                        })
                    }
                    form.push(formItem)
                }
                this.formDynamic.items = form
            },
            download (url) {
                if (!url) {
                    return
                }
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                // download 属性定义了下载链接的地址而不是跳转路径
                link.setAttribute('download', '文件.jpg')
                document.body.appendChild(link)
                link.click()
            },
            drawPieChart (elementId, legend, data, state) {
                let title = '临期时间'
                let myChart = echarts.init(document.getElementById(elementId));
                myChart.setOption({
                    title: {
                        text: title,
                        subtext: '饼状图',
                        x: 'center',
                        textStyle: {
                            color: '#cfcfcf'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        // bottom: 'bottom',
                        data: legend,
                        textStyle: {
                            color: '#cfcfcf'
                        }
                    },
                    series: [
                        {
                            name: '临期时间',
                            type: 'pie',
                            radius: '45%',
                            center: ['45%', '60%'],
                            data: data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    h4 {
        line-height: 40px;
    }
    .regime-btn {
        width: 100%;
        margin-bottom: 8px;
        overflow: hidden;
        div:first-child {
            width: 80%;
            line-height: 32px;
            text-align: left;
        }
    }
    .item-copy {
        width: 45%;
        float: left;
    }
</style>
