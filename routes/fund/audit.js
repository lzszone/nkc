const Router = require('koa-router');
const auditRouter = new Router();
auditRouter
//审核页面
	.get('/', async (ctx, next) => {
		const {data, query} = ctx;
		const {user, applicationForm} = data;
		const {type} = query;
		data.type = type;
		const {fund, lock} = applicationForm;
		if(type === 'project') {
			data.nav = '项目审查员审核';
			const {certs, appointed} = fund.censor;
			for(let cert of certs) { // 不合理的证书判断
				if(!user.certs.includes(cert) && !appointed.includes(user.uid)) ctx.throw(401, '权限不足');
			}
			if(applicationForm.status.projectPassed !== null) ctx.throw(400, '抱歉！该申请表已被其他审查员审核了。');
			if(!applicationForm.status.submitted || !applicationForm.lock.submitted) ctx.throw(400, '申请表暂未提交。');
			const {auditing, uid, timeToOpen, timeToClose} = lock;
			const {timeOfAudit} = ctx.settings.fund;
			if(!auditing || (Date.now() - timeToOpen) > timeOfAudit) { // 没有人正在审核或审核超时
				lock.uid = user.uid;
				lock.timeToOpen = Date.now();
				lock.timeToClose = null;
				lock.auditing = true;
				await applicationForm.save();
			} else { // 有人正在审核且未超时
				//若审查员是自己则继续审核
				if(user.uid !== uid) ctx.throw(400, '抱歉！该申请表正在被其他审查员审核。')
			}
		} else if(type === 'admin'){
			data.nav = '管理员审核';
			if(data.userLevel < 7) ctx.throw(401, '抱歉！您没有管理员的权限。');
			if(applicationForm.status.adminSupport !== null) ctx.throw(400, '抱歉！该申请表已被其他管理员审核了。');
			if(!applicationForm.status.projectPassed) ctx.throw(400, '项目审核暂未通过，请等待。');
			const {auditing, uid, timeToOpen, timeToClose} = lock;
			const {timeOfAudit} = ctx.settings.fund;
			if(!auditing || (Date.now - timeToOpen) > timeOfAudit) { // 没有人正在审核或审核超时
				lock.uid = user.uid;
				lock.timeToOpen = Date.now();
				lock.timeToClose = null;
				lock.auditing = true;
				await applicationForm.save();
			} else { // 有人正在审核且未超时
				//若审查员是自己则继续审核
				if(user.uid !== uid) ctx.throw(400, '抱歉！该申请表正在被其他管理员审核。')
			}
		} else {
			ctx.throw(400, '未知的type类型。');
		}
		ctx.template = 'interface_fund_audit.pug';
		await next();
	})
	//审核提交
	.post('/', async (ctx, next) => {
		const {data, body, db} = ctx;
		const {user, applicationForm} = data;
		const {budgetMoney, fund, lock} = applicationForm;
		const {certs, appointed} = fund.censor;
		const {type} = body;
		lock.timeToClose = Date.now();
		lock.auditing = false;
		let support = true;
		if(type === 'project') { // 项目审核
			for(let cert of certs) { // 不合理的证书判断
				if(!user.certs.includes(cert) && !appointed.includes(user.uid)) ctx.throw(401, '权限不足');
			}
			if(applicationForm.status.projectPassed !== null) ctx.throw(400, '抱歉！该申请表已被其他审查员审核了。');
			if(!applicationForm.status.submitted) ctx.throw(400, '申请表暂未提交。');
			const {uid} = lock;
			if(user.uid !== uid) {
				ctx.throw(400, '抱歉！您的审核已经超时啦，该申请表正在被其他审查员审核。');
			}
			const {suggestMoney, comments} = body;
			await Promise.all(comments.map(async comment => {
				if(!comment.support) support = false;
				const documentId = await db.SettingModel.operateSystemID('fundDocuments', 1);
				const newDocument = new db.FundDocumentModel({
					_id: documentId,
					uid: user.uid,
					applicationFormId: applicationForm._id,
					type: comment.type,
					c: comment.c,
					support: comment.support
				});
				await newDocument.save();
			}));
			applicationForm.status.projectPassed = support;
			if(support) {
				//添加项目审查员的预算建议
				if(budgetMoney.length !== suggestMoney.length) ctx.throw(400, '建议金额个数不匹配。');
				let total = 0;
				let suggest = 0;
				for(let i = 0; i < suggestMoney.length; i++) { //就预算金额，项目审查员给管理员的建议
					const m = suggestMoney[i];
					total += budgetMoney[i].money;
					suggest += m;
					budgetMoney[i].suggest = m;
				}
				if(total*0.8 > suggest) ctx.throw(400, '建议的金额小于原金额的80%，只能选择不通过。');
				await applicationForm.update({budgetMoney});
			}
		} else if(type === 'admin') {// 最后管理员审核
			if(data.userLevel < 7) ctx.throw(401, '抱歉！您没有管理员的权限。');
			if(!applicationForm.status.projectPassed) ctx.throw(400, '项目审核暂未通过，请等待。');
			const {uid} = lock;
			if(user.uid !== uid) {
				ctx.throw(400, '抱歉！您的审核已经超时啦，该申请表正在被其他管理员审核。');
			}
			const {c, support, factMoney, remittance, needThreads} = body;
			if(support) {
				if(applicationForm.fixedMoney || remittance.length === 0) {
					applicationForm.remittance = [{
						money: applicationForm.factMoney,
						status: null
					}];
				} else {
					for (let m of remittance) {
						applicationForm.remittance.push({
							money: m,
							status: null,
							report: null,
							passed: null,
							needThreads
						});
					}
				}
				//添加实际资金预算
				if(budgetMoney.length !== factMoney.length) ctx.throw(400, '建议金额个数不匹配。');
				let total = 0;
				let fact = 0;
				for(let i = 0; i < factMoney.length; i++) { //实际资金预算
					const m = factMoney[i];
					total += budgetMoney[i].money;
					fact += m;
					budgetMoney[i].fact = m;
				}
				if(total*0.8 > fact) ctx.throw(400, '建议的金额小于原金额的80%，只能选择不通过。');
				await applicationForm.update({budgetMoney});
			}
			const documentId = await db.SettingModel.operateSystemID('fundDocuments', 1);
			const newDocument = db.FundDocumentModel({
				_id: documentId,
				uid: user.uid,
				applicationFormId: applicationForm._id,
				type: 'adminAudit',
				support,
				c
			});
			await newDocument.save();
			applicationForm.status.adminSupport = support;
		} else {
			ctx.throw(400, '未知的type类型。');
		}
		if(!support && applicationForm.modifyCount >= fund.modifyCount) {
			applicationForm.useless = 'exceededModifyCount';
		}
		await applicationForm.save();
		await next();
	});
module.exports = auditRouter;