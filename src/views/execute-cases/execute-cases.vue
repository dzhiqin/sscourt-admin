<template>
  <div class="app-container exe-case">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="partyPerson" label="当事人姓名">
          <el-input v-model="searchData.partyPerson" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="cardNum" label="证件号">
          <el-input v-model="searchData.cardNum" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="caseNo" label="案号">
          <el-input v-model="searchData.caseNo" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="caseName" label="案件名称">
          <el-input v-model="searchData.caseName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="undertakeDepart" label="承办部门">
          <el-input v-model="searchData.undertakeDepart" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="flex align-center">
        <div>模板下载</div>
        <a :href="`${baseUrl}/propertyMains/templateExport`" class="margin-left">
          <el-button :icon="Download" type="success" plain>案件基本信息模板</el-button>
        </a>
        <a :href="`${baseUrl}/propertyMains/templatePersonExport`" class="margin-left">
          <el-button :icon="Download" type="success" plain>案件当事人模板</el-button>
        </a>
        <a :href="`${baseUrl}/propertyLinks/detentionInfoTemplateExport`" class="margin-left">
          <el-button :icon="Download" type="success" plain>拘留信息模板</el-button>
        </a>
        <a :href="`${baseUrl}/propertyLinks/limitingHighTemplateExport`" class="margin-left">
          <el-button :icon="Download" type="success" plain>限高信息模板</el-button>
        </a>
        <a :href="`${baseUrl}/propertyLinks/lostInfoTemplateExport`" class="margin-left">
          <el-button :icon="Download" type="success" plain>失信信息模板</el-button>
        </a>
        <a :href="`${baseUrl}/propertyDisposeInfos/templateExport`" class="margin-left">
          <el-button :icon="Download" type="success" plain>财产处理模板</el-button>
        </a>
      </div>
      <div class="flex align-center margin-top">
        <div>数据上传</div>
        <el-upload
          :icon="Upload"
          type="success"
          class="margin-left"
          accept=".xls,.xlsx"
          :action="`${baseUrl}/propertyMains/importPropertyMain`"
          :limit="1"
        >
          <template #trigger>
            <el-button :icon="Upload" type="primary">基本信息上传</el-button>
          </template>
        </el-upload>
        <el-upload
          :icon="Upload"
          type="success"
          class="margin-left"
          accept=".xls,.xlsx"
          :action="`${baseUrl}/propertyMains/importPropertyMainPerson`"
          :limit="1"
        >
          <template #trigger>
            <el-button :icon="Upload" type="primary">当事人信息上传</el-button>
          </template>
        </el-upload>
        <el-upload
          :icon="Upload"
          type="success"
          class="margin-left"
          accept=".xls,.xlsx"
          :action="`${baseUrl}/propertyLinks/importPropertyDetentionInfo`"
          :limit="1"
        >
          <template #trigger>
            <el-button :icon="Upload" type="primary">拘留信息上传</el-button>
          </template>
        </el-upload>
        <el-upload
          :icon="Upload"
          type="success"
          class="margin-left"
          accept=".xls,.xlsx"
          :action="`${baseUrl}/propertyLinks/importPropertyLimitingHighInfo`"
          :limit="1"
        >
          <template #trigger>
            <el-button :icon="Upload" type="primary">限高信息上传</el-button>
          </template>
        </el-upload>
        <el-upload
          :icon="Upload"
          type="success"
          class="margin-left"
          accept=".xls,.xlsx"
          :action="`${baseUrl}/propertyLinks/importPropertyLostInfo`"
          :limit="1"
        >
          <template #trigger>
            <el-button :icon="Upload" type="primary">失信信息上传</el-button>
          </template>
        </el-upload>
        <el-upload
          :icon="Upload"
          type="success"
          class="margin-left"
          accept=".xls,.xlsx"
          :action="`${baseUrl}/propertyDisposeInfos/importPropertyDisposeInfo`"
          :limit="1"
        >
          <template #trigger>
            <el-button :icon="Upload" type="primary">财产信息上传</el-button>
          </template>
        </el-upload>
      </div>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="caseNo" label="案号" align="center" />
          <el-table-column prop="caseName" label="案件名称" align="center" />
          <el-table-column prop="createDate" label="立案日期" align="center" />
          <el-table-column prop="causeFiling" label="案由" align="center" />
          <el-table-column prop="partyPerson" label="当事人" align="center" width="180" />
          <el-table-column prop="applyAmount" label="申请执行标的额" align="center" />
          <el-table-column prop="finishAmount" label="结案标的额" align="center" />
          <el-table-column prop="caseExaminer" label="立案审查人" align="center" />
          <el-table-column prop="closeCase" label="结案事由" align="center" />
          <el-table-column prop="closeClassify" label="结案方式" align="center" />
          <el-table-column prop="courtClerk" label="书记员" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="showDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" title="案件详情" width="1500">
      <div>
        <div class="flex flex-between">
          <el-card>
            <template #header>基本信息</template>
            <div>案号:{{ currentRow.caseNo }}</div>
            <div class="margin-top-sm">案件名称:{{ currentRow.caseName }}</div>
            <div class="margin-top-sm">当事人:{{ currentRow.partyPerson }}</div>
            <div class="margin-top-sm">立案日期:{{ currentRow.createDate }}</div>

            <div class="margin-top-sm">立案案由:{{ currentRow.causeFiling }}</div>
            <div class="margin-top-sm">立案审查人:{{ currentRow.caseExaminer }}</div>
            <div class="margin-top-sm">案件特征:{{ currentRow.caseFeature }}</div>

            <div class="margin-top-sm">原审法院:{{ currentRow.oldCourt }}</div>
            <div class="margin-top-sm">原审结案方式:{{ currentRow.oldFinishClassify }}</div>
            <div class="margin-top-sm">分案日期:{{ currentRow.subdivisionDate }}</div>
            <div class="margin-top-sm">创建时间:{{ currentRow.createTime }}</div>
            <div class="margin-top-sm">创建人:{{ currentRow.createUser }}</div>
          </el-card>
          <el-card>
            <template #header>案件信息</template>
            <div>案件来源:{{ currentRow.caseResource }}</div>
            <div class="margin-top-sm">收案途经:{{ currentRow.receivingCases }}</div>
            <div class="margin-top-sm">收案日期:{{ currentRow.receiptDate }}</div>
            <div class="margin-top-sm">文书上网状态:{{ currentRow.instrumentStatus }}</div>
            <div class="margin-top-sm">合议庭成员:{{ currentRow.collegiatePerson }}</div>
            <div class="margin-top-sm">审判长:{{ currentRow.chiefJudge }}</div>

            <div class="margin-top-sm">书记员:{{ currentRow.courtClerk }}</div>
            <div class="margin-top-sm">法官助理:{{ currentRow.judgeAssistant }}</div>
            <div class="margin-top-sm">法定年限:{{ currentRow.legalTerm }}</div>

            <div class="margin-top-sm">来源地区:{{ currentRow.resourceArea }}</div>
            <div class="margin-top-sm">系列案:{{ currentRow.seriesCases }}</div>
            <div class="margin-top-sm">状态:{{ currentRow.status }}</div>
            <div class="margin-top-sm">审限状态:{{ currentRow.trialStatus }}</div>
            <div class="margin-top-sm">承办部门:{{ currentRow.undertakeDepart }}</div>
            <div class="margin-top-sm">承办人:{{ currentRow.undertaker }}</div>
          </el-card>
          <el-card>
            <template #header>执行信息</template>
            <div>结案事由:{{ currentRow.closeCase }}</div>
            <div class="margin-top-sm">结案日期:{{ currentRow.finishDate }}</div>
            <div class="margin-top-sm">期限:{{ currentRow.deadline }}</div>
            <div class="margin-top-sm">执行案由:{{ currentRow.causeExecution }}</div>
            <div class="margin-top-sm">结案方式:{{ currentRow.closeClassify }}</div>
            <div class="margin-top-sm">结案文书:{{ currentRow.closeInstrument }}</div>
            <div class="margin-top-sm">执行依据种类:{{ currentRow.executionClassify }}</div>
            <div class="margin-top-sm">做出执行依据单位:{{ currentRow.instrumentDepart }}</div>
            <div class="margin-top-sm">执行依据主文:{{ currentRow.executionContent }}</div>
            <div class="margin-top-sm">执行依据文书类型:{{ currentRow.executionInstrumentClassify }}</div>
            <div class="margin-top-sm">执行依据文号:{{ currentRow.executionNumber }}</div>
            <div class="margin-top-sm">归档日期:{{ currentRow.filingDate }}</div>
            <div class="margin-top-sm">结案标的额:{{ currentRow.finishAmount }}</div>
            <div class="margin-top-sm">执行依据生效日期:{{ currentRow.instrumentStartTime }}</div>
            <div class="margin-top-sm">实际到位标的额:{{ currentRow.realAmount }}</div>
          </el-card>
        </div>
        <el-card class="box-card" v-loading="busy">
          <template #header>案件当事人人列表</template>
          <el-table :data="clients">
            <el-table-column prop="caseNo" label="案号" align="center" width="180" />
            <el-table-column prop="linkName" label="姓名" align="center" />
            <el-table-column prop="linkSex" label="性别" align="center" />
            <el-table-column prop="linkPhone" label="电话" align="center" />
            <el-table-column prop="birthday" label="出生日期" align="center" />
            <el-table-column prop="age" label="年龄" align="center" />
            <el-table-column prop="address" label="地址" align="center" width="180" />
            <el-table-column prop="culture" label="文化程度" align="center" />
            <el-table-column prop="nationality" label="民族" align="center" />
            <el-table-column prop="linkArea" label="国籍/地区" align="center" />
            <el-table-column prop="occupation" label="职业" align="center" />
            <el-table-column prop="personClassify" label="类型" align="center" />
            <el-table-column prop="politicsStatus" label="政治面貌" align="center" />
            <el-table-column prop="cardNum" label="证件号码" align="center" />
            <el-table-column prop="cardType" label="证件种类" align="center" />
            <el-table-column prop="caseExaminer" label="立案审查人" align="center" />
            <el-table-column prop="courtClerk" label="书记员" align="center" />
            <el-table-column prop="enterpriseCode" label="单位机构代码" align="center" />
            <el-table-column prop="enterpriseType" label="单位性质" align="center" />
            <el-table-column prop="judgeAssistant" label="法官助理" align="center" />
            <el-table-column prop="lawStatus" label="法律地位" align="center" />
            <el-table-column prop="legalCardNum" label="法定代表人证件号" align="center" />
            <el-table-column prop="legalCardType" label="法定代表人证件类型" align="center" />
            <el-table-column prop="legalName" label="法定代表人姓名" align="center" />
            <el-table-column prop="postalCode" label="邮政编码" align="center" />
            <el-table-column prop="queryPassword" label="查询密码" align="center" />
            <el-table-column prop="queryUser" label="查询账号" align="center" />
            <el-table-column prop="undertaker" label="承办人" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="createUser" label="创建人" align="center" />
          </el-table>
        </el-card>
        <el-card class="box-card" v-loading="busy">
          <template #header>案件财产处置列表</template>
          <el-table :data="properties">
            <el-table-column prop="caseNo" label="案号" align="center" />
            <el-table-column prop="caseReason" label="案由" align="center" />
            <el-table-column prop="username" label="被拘留人" align="center" />
            <el-table-column prop="address" label="住所地" align="center" />
            <el-table-column prop="birthday" label="出生日期" align="center" />
            <el-table-column prop="cardNum" label="身份证号" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="createUser" label="创建人" align="center" />
            <el-table-column prop="undertaker" label="承办人" align="center" />
          </el-table>
        </el-card>
        <el-card class="box-card" v-loading="busy">
          <template #header>案件拘留人列表</template>
          <el-table :data="detainees">
            <el-table-column prop="bePerformedPersonName" label="被执行人姓名" align="center" />
            <el-table-column prop="bePerformedPersonNumber" label="被执行人证件号" align="center" />
            <el-table-column prop="propertyInfo" label="财产信息" align="center" />
            <el-table-column prop="propertyClassify" label="财产类别" align="center" />
            <el-table-column prop="undertaker" label="承办人" align="center" />
            <el-table-column prop="caseNo" label="执行案号" align="center" />
            <el-table-column prop="closeTime" label="查封时间" align="center" />
            <el-table-column prop="detainTime" label="扣押时间" align="center" />
            <el-table-column prop="appraisalAgency" label="评估机构" align="center" />
            <el-table-column prop="inquiryTime" label="移送评估询价时间" align="center" />
            <el-table-column prop="appraisalMoney" label="评估价格" align="center" />
            <el-table-column prop="enquiryTime" label="评估/询价时间" align="center" />
            <el-table-column prop="queryMoney" label="询价结果" align="center" />
            <el-table-column prop="disposeResult" label="处置结果" align="center" />
            <el-table-column prop="finalReportInfo" label="结案信息" align="center" />
            <el-table-column prop="makeMoney" label="成交价格" align="center" />
            <el-table-column prop="oneBeatTime" label="一拍时间" align="center" />
            <el-table-column prop="towBeatTime" label="二拍时间" align="center" />
            <el-table-column prop="sellOffTime" label="变卖时间" align="center" />
            <el-table-column prop="sendMontyTime" label="案款发放时间" align="center" />
            <el-table-column prop="memo" label="备注" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="createUser" label="创建人" align="center" />
          </el-table>
        </el-card>
        <el-card class="box-card" v-loading="busy">
          <template #header>案件限高人列表</template>
          <el-table :data="limits">
            <el-table-column prop="username" label="姓名" align="center" />
            <el-table-column prop="cardNum" label="证件号码" align="center" />
            <el-table-column prop="caseNo" label="案号" align="center" />
            <el-table-column prop="personClassify" label="人员类型" align="center" />
            <el-table-column prop="resource" label="来源" align="center" />
            <el-table-column prop="status" label="状态" align="center" />
            <el-table-column prop="issueDate" label="发布时间" align="center" />
            <el-table-column prop="expirationDate" label="届满时间" align="center" />
            <el-table-column prop="perRelieveDate" label="单次解除时间" align="center" />
            <el-table-column prop="publicDate" label="公开时间" align="center" />
            <el-table-column prop="relieveDate" label="解除时间" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="createUser" label="创建人" align="center" />
          </el-table>
        </el-card>
        <el-card class="box-card" v-loading="busy">
          <template #header>案件失信人列表</template>
          <el-table :data="dishonesties">
            <el-table-column prop="caseNo" label="案号" align="center" />
            <el-table-column prop="username" label="姓名" align="center" />
            <el-table-column prop="userType" label="类型" align="center" />
            <el-table-column prop="cardNum" label="执行法院" align="center" />
            <el-table-column prop="createDate" label="立案时间" align="center" />
            <el-table-column prop="enterpriseCode" label="组织机构代码" align="center" />
            <el-table-column prop="status" label="状态" align="center" />
            <el-table-column prop="issueDate" label="发布时间" align="center" />
            <el-table-column prop="issuePerson" label="发布人" align="center" />
            <el-table-column prop="lostContent" label="失信行为情形" align="center" />
            <el-table-column prop="lostDueDate" label="失信到期日" align="center" />
            <el-table-column prop="repealDate" label="撤销时间" align="center" />
            <el-table-column prop="shielDate" label="屏蔽时间" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="createUser" label="创建人" align="center" />
          </el-table>
        </el-card>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from "vue"
import { usePagination } from "@/hooks/usePagination"
import { Search, Refresh, Upload, Download } from "@element-plus/icons-vue"
import { getCaseList, getCaseDetail } from "@/api/cases.api"
defineOptions({
  name: "Executecases"
})
const baseUrl = import.meta.env.VITE_BASE_API
const loading = ref(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  cardNum: "",
  caseNo: "",
  caseName: "",
  partyPerson: "",
  undertakeDepart: ""
})
const dialogVisible = ref(false)
const currentRow = ref(null)
const searchFormRef = ref(null)
const tableData = ref([])
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
const detainees = ref([])
const properties = ref([])
const limits = ref([])
const clients = ref([])
const dishonesties = ref([])
const busy = ref(false)
const showDetail = (row) => {
  currentRow.value = row
  dialogVisible.value = true
  busy.value = true
  getCaseDetail({ caseNo: row.caseNo })
    .then((res) => {
      detainees.value = res.data.propertyDetentionInfoList
      properties.value = res.data.propertyDisposeInfoList
      limits.value = res.data.propertyLimitingHighInfoList
      dishonesties.value = res.data.propertyLostInfoList
      clients.value = res.data.propertyMainPersonList
    })
    .catch(() => {
      detainees.value = []
      properties.value = []
      limits.value = []
      dishonesties.value = []
      clients.value = []
    })
    .finally(() => {
      busy.value = false
    })
}
const getTableData = () => {
  loading.value = true
  getCaseList({
    pageSize: paginationData.pageSize,
    pageNum: paginationData.currentPage,
    cardNum: searchData.cardNum,
    caseName: searchData.caseName,
    caseNo: searchData.caseNo,
    partyPerson: searchData.partyPerson,
    undertakeDepart: searchData.undertakeDepart
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.records
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
