import React, { Component } from 'react'
import WaterMark from '/components/watermark/WaterMark.jsx'

const InboxMap = {
	notice: 'notice/notice.jsx',
	noticelist: 'notice/noticeList.jsx',
	message: 'notice/message.jsx',
	mgr: 'system/mgr.jsx',
	role: 'system/role.jsx',
	company: 'system/company.jsx',
	dept: 'system/dept.jsx',
	log: 'system/log.jsx',
	menu: 'system/menu.jsx',
	dict: 'system/dict.jsx', 
	dictdata: 'system/dictData.jsx',
	department: 'mtn/department.jsx',
	orgpost: 'mtn/orgpost.jsx',
	param: 'system/param.jsx',
	changePassword: 'changePassword.jsx',

	applymine: 'process/apply.jsx',
	applytodo: 'process/apply.jsx',
	applydone: 'process/apply.jsx',

	resumetemplate: 'resume/resumetemplate.jsx',
	project: 'project/project.jsx',
	projectIndex: 'project/projectIndex.jsx',
	staff_add: 'staff/staff.jsx',
	staff_list: 'staff/staffapply.jsx',
	staff_paper: 'staff/staffcertpaper.jsx',
	staffForm: 'staff/staffForm.jsx',
	staffapplyForm: 'staff/staffapplyForm.jsx',
	resumeapplyForm: 'staff/resumeapplyForm.jsx',
	staffpicapplyForm: 'staff/staffpicapplyForm.jsx',
	staff_apply: 'staff/staffallapplyForm.jsx',

	social_add: 'social/social.jsx',
	social_list: 'social/socialapply.jsx',
	socialapplyForm: 'social/socialapplyForm.jsx',

	contractIndex: 'contract/contractIndex.jsx',
	anli_add: 'contract/contract.jsx',
	contapplyForm: 'contract/contapplyForm.jsx',
	anli_list: 'contract/contsaleApply.jsx',
	anli_paper: 'contract/contpaper.jsx',
	anli_first: 'contract/contListFirst.jsx',
	anli_second: 'contract/contListSecond.jsx',
	anli_third: 'contract/contListThird.jsx',
	anli_ctemp: 'contemp/contemp.jsx',
	contempForm: 'contemp/contempForm.jsx',

	cert_type: 'cert/certtype.jsx',
	cert_column: 'cert/certColumn.jsx',
	cert_add: 'cert/cert.jsx',
	cert_list: 'cert/certapply.jsx',
	certapplyForm: 'cert/certapplyForm.jsx',
	certeapplyForm: 'cert/certeapplyForm.jsx',
	cert_paper: 'cert/certpaper.jsx',

	store_storage: 'mtn/storage.jsx',
	report_list: 'report/reportList.jsx',
	report_view_list: 'report/reportViewList.jsx',
	report_chart: 'report/reportChart.jsx',
	report_view: 'report/reportView.jsx',
	report_group: 'report/reportGroup.jsx',

	inv_list: 'invoice/invoice.jsx',
	inv_search: 'invoice/invoicelist.jsx',
	inv_paper: 'invoice/invoiceOriginal.jsx',

	branch: 'branch/branchlist.jsx',
	branchForm: 'branch/branchindex.jsx',
	spare_store: 'branch/storelist.jsx',
	spare_system: 'branch/spareSystem.jsx',
	storeForm: 'branch/storeindex.jsx',
	branch_view: 'branch_view/branchlist.jsx',
	branchForm_view: 'branch_view/branchindex.jsx',
	storeForm_view: 'branch_view/storeindex.jsx',
	spare_store_view: 'branch_view/storelist.jsx',
	branch_apply_form: 'branch_view/branchApplyForm.jsx',
	branch_paper: 'branch_view/branchOriginal.jsx',
	branch_storage: 'branch_view/branchStorage.jsx',
	storage_apply: 'branch_view/storageApply.jsx',

	finance_paper: 'finance/financeIndex.jsx',
	finance_state: 'finance/financeState.jsx',
	finance_paper_view: 'finance_view/financeIndex.jsx',
	finance_apply_form: 'finance_view/financeApplyForm.jsx',
	finance_original: 'finance_view/financeOriginal.jsx',
	propaganda_cls: 'propaganda/propagandaCls.jsx',
	propaganda_ma: 'propaganda/propagandaMa.jsx',
	propaganda_view: 'propaganda/propagandaView.jsx',
	trial_list: 'trial/trialList.jsx',
	trial_detail: 'trial/trialDetail.jsx',
	insurance_list: 'insurance/insuranceList.jsx',
	insurance_detail: 'insurance/insuranceDetail.jsx',
	insurance_agent: 'insurance/insuranceAgent.jsx',
	insurance_search: 'insurance/insuranceSearch.jsx',
}

class Inbox extends Component{

	async componentWillMount() {
		let path = this.props.pane.url
		let reqparam = {}
		if (path.indexOf('?') > 0) {
			reqparam = this.getParams(path.substring(path.indexOf('?') + 1))
			path = path.substring(0, path.indexOf('?'))
		}
		let params = Object.assign(reqparam, {grpath: path} ,this.props.pane.params)
		let name = InboxMap[path]
	  await import(`/page/${name}`).then(doc => {
	    this.setState({ TheComponent: doc.default, params});
	  })
	}

	getParams = s => {
		let search = {}
		let a = [s]
		if (s.length > 1 && s.indexOf('&') > 0 && s) {
			a = s.split('&')
		}
		a.forEach(val => {
			let b = val.split('=')
			search[b[0]] = b[1]
		})
		return search
	}

	state = {
    TheComponent: null,
    params: {}
  }

	render = _ => {
		let TheComponent = this.state.TheComponent;
		return TheComponent == null ? <div></div> : <div className='container-div' style={{background: '#fff',paddingBottom: '22px', minHeight: '600px'}}><WaterMark
        ><TheComponent  params={this.state.params} /></WaterMark></div>
	}
}

export default Inbox