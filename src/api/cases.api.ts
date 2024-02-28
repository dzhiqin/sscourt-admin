import { request } from "@/utils/service"
export const getCaseList = (data: {
  pageNum: number
  pageSize: number
  cardNum: string
  caseName: string
  caseNo: string
  partyPerson: string
  undertakeDepart: string
}) => {
  return request({
    url: `propertyMains/page/${data.pageNum}/${data.pageSize}`,
    method: "post",
    data
  })
}
export const getCaseDetail = (params: { caseNo: string }) => {
  return request({
    url: "propertyMains/detail",
    method: "get",
    params
  })
}
