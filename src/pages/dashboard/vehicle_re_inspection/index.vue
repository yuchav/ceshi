<template>
    <main class="body-content-main">
        <div class="content-layout-right user-full-screen ivu-overflow-auto" :class="{ 'content-layout-right-pro': this.menuCollapse }"
            ref="right">
            <div class="ivu-block">
                <Form :model="formItem" :label-width="70"  inline :label-colon="true"
                      class="real-time-form ivu-inline-block user-full-screen">
                    <div class="ivu-form-item" style="line-height: 32px;">
                        功能操作
                    </div>
                    <FormItem label="输入搜索">
                        <Input v-model="formItem.input" placeholder="证件号码/名称" size="small"
                               style="width: 200px"></Input>
                    </FormItem>
                    <FormItem label="车辆类型" >
                        <Select v-model="formItem.type" size="small"
                                class="ivu-nomal-select"
                                style="width: 180px">
                            <Option value="1">内部</Option>
                            <Option value="0">外部</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="进入时间" >
                        <DatePicker type="daterange" placement="bottom-end"
                                    placeholder="选择进入时间"
                                    v-model="formItem.dateTime"
                                    size="small"
                                    style="width: 200px;"></DatePicker>
                        <Button type="primary" size="small" @click="reloadTable"
                                class="ivu-query-btn ivu-ml-40"
                                style="margin-right: 20px;">查询结果</Button>
                        <Button size="small" @click="reloadTable(false)" style="margin-right: 20px;">重置查询</Button>
                        <Button  size="small" style="margin-right: 8px;"
                                 @click="exportData" >
                            <Icon type="md-arrow-round-down" />
                            导出
                        </Button>
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
                                    v-if="key < (table.columns.length - 3)"
                                    :key="key">{{ item.title }}</Option>
                        </Select>
                    </div>
                </Form>
                <Table border  :loading="table.loading" :columns="table.columns"
                       :data="table.data" size="small" ref="table">
                    <template slot-scope="{ row }" slot="preview1" >
                        <Button size="small" type="primary" @click="preview(1, row)">预览</Button>
                    </template>
                    <template slot-scope="{ row }" slot="preview2" >
                        <Button size="small" type="primary" @click="preview(2, row)">预览</Button>
                    </template>
                </Table>
            </div>
            <div class="ivu-block" style="float: right;margin-top: 30px;">
                <Page :total="page.total" :page-size="page.pageSize"
                      show-total show-elevator size="small"
                      @on-change="reloadTable(true, $event)"/>
            </div>
        </div>
        <Modal v-model="modalInfo.status" width="360">
            <p slot="header" style="color:#3095ff;text-align:center" v-if="!modalInfo.isSign">
                <span>查看照片</span>
            </p>
            <p slot="header" style="color:#3095ff;text-align:center" v-else>
                <span>电子签字</span>
            </p>
            <div class="ivu-block ivu-text-center user-full-img">
                <img :src="modalInfo.imgUrl" alt="">
            </div>
        </Modal>
    </main>
</template>
<script>
    import { mapState } from 'vuex';
    import { getVehicleReInspection } from '@api';
    export default {
        name: 'dashboard-vehicle-re-inspection',
        data () {
            return {
                title: '临时存储',
                formItem: {
                    input: undefined,
                    type: undefined,
                    sortWay: undefined,
                    dateTime: undefined,
                    page: 1,
                    pageSize: 1
                },
                page: {
                    loading: false,
                    total: 12,
                    pageSize: 10
                },
                modalInfo: {
                    status: false,
                    isSign: false,
                    imgUrl: ''
                },
                table: {
                    loading: false,
                    columns: [
                        {
                            title: '序号',
                            align: 'center',
                            width: '100',
                            key: 'id'
                        },
                        {
                            title: '时间',
                            align: 'center',
                            width: '140',
                            key: 'time'
                        },
                        {
                            title: '车牌号码',
                            align: 'center',
                            width: '100',
                            key: 'plateNumber'
                        },
                        {
                            title: '驾驶员',
                            align: 'center',
                            width: '80',
                            key: 'driver'
                        },
                        {
                            title: '驾驶员证件号码',
                            align: 'center',
                            width: '140',
                            key: 'driverID'
                        },
                        {
                            title: '驾驶员联系方式',
                            align: 'center',
                            width: '140',
                            key: 'driverContact'
                        },
                        {
                            title: '行驶证',
                            align: 'center',
                            width: '120',
                            key: 'vehicleLicense'
                        },
                        {
                            title: '押运员',
                            align: 'center',
                            width: '80',
                            key: 'supercargo'
                        },
                        {
                            title: '押运员证件号码',
                            align: 'center',
                            width: '140',
                            key: 'supercargoID'
                        },
                        {
                            title: '押运员联系方式',
                            align: 'center',
                            width: '140',
                            key: 'supercargoContact'
                        },
                        {
                            title: '门禁卡',
                            align: 'center',
                            width: '100',
                            key: 'entranceCard'
                        },
                        {
                            title: '进入原因',
                            align: 'center',
                            width: '100',
                            key: 'enterReason'
                        },
                        {
                            title: '危险货物安全卡',
                            align: 'center',
                            width: '150',
                            key: 'securityCard'
                        },
                        {
                            title: '危险品顶灯',
                            align: 'center',
                            width: '150',
                            key: 'dangerousLevel'
                        },
                        {
                            title: '危险品告示牌',
                            align: 'center',
                            width: '150',
                            key: 'dangerousSign'
                        },
                        {
                            title: '危险品三角架',
                            align: 'center',
                            width: '150',
                            key: 'dangerousTripod'
                        },
                        {
                            title: '灭火器',
                            align: 'center',
                            width: '100',
                            key: 'fireExtinguisher'
                        },
                        {
                            title: '箱车锁扣、安全扣',
                            align: 'center',
                            width: '150',
                            key: 'safetyBuckle'
                        },
                        {
                            title: '车辆外观异常',
                            align: 'center',
                            width: '150',
                            key: 'appearance'
                        },
                        {
                            title: '防火罩',
                            align: 'center',
                            width: '100',
                            key: 'flameproofEnclosure'
                        },
                        {
                            title: '轮胎有无异常',
                            align: 'center',
                            width: '150',
                            key: 'tire'
                        },
                        {
                            title: '漏水漏油',
                            align: 'center',
                            width: '120',
                            key: 'leaking'
                        },
                        {
                            title: '车辆类型',
                            align: 'center',
                            width: '120',
                            key: 'vehicleType'
                        },
                        {
                            title: '电子签字',
                            align: 'center',
                            width: '100',
                            slot: 'preview1',
                            key: 'signature'
                        },
                        {
                            title: '照片',
                            align: 'center',
                            width: '100',
                            slot: 'preview2',
                            key: 'photo'
                        },
                        {
                            title: '备注',
                            align: 'center',
                            width: '150',
                            key: 'note'
                        }
                    ],
                    data: []
                }
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'isMobile',
                'isTablet',
                'screenHeight',
                'isDesktop',
                'menuCollapse'
            ])
        },
        created () {
            this.getVehicleReInspectionTableByParam()
        },
        mounted () {
            // 设置屏幕的宽度高度
            this.$refs.right.style.height = this.screenHeight + 'px'
        },
        methods: {
            reloadTable (state = true, event) {
                if (state) {
                    this.formItem.page = event === undefined ? 1 : event
                    this.pageSize = parseInt(this.formItem.pageSize);
                } else {
                    this.formItem = {
                        input: undefined,
                        type: undefined,
                        sortWay: undefined,
                        dateTime: undefined,
                        page: 1,
                        pageSize: 1
                    }
                }
                this.getVehicleReInspectionTableByParam(this.formItem)
            },
            getVehicleReInspectionTableByParam (param = null) {
                let that = this
                that.table.loading = true
                if (param !== null && param.dateTime) {
                    let temp = []
                    param.dateTime.map(function (value, index, array) {
                        temp.push(new Date(value).getTime())
                    })
                    param.dateTime = temp
                }
                console.log('param', param)
                getVehicleReInspection(param).then(async res => {
                    that.table.data = res.tableData.data
                    that.page.total = res.tableData.total
                    that.table.loading = false
                })
            },
            preview (state, row) {
                if (state === 1) {
                    // 预览
                    this.modalInfo.isDate = false
                    this.modalInfo.isSign = true
                    this.modalInfo.imgUrl = row.signature
                } else {
                    this.modalInfo.isSign = false
                    this.modalInfo.imgUrl = row.photo
                }
                this.modalInfo.status = true
            },
            exportData () {
                this.$refs.table.exportCsv({
                    filename: 'Custom data',
                    original: false,
                    columns: this.table.columns, // filter((col, index) => index < 12),
                    data: this.table.data
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
