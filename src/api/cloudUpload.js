/***
 *  资料库--腾讯云 上传方法
 * @auth yyp
 */

let COS = require('cos-js-sdk-v5');
let cos = new COS({
	SecretId: 'AKIDZZOwINWfQ6jqjnOqWy93OWaYGm0Co2iR',
	SecretKey: 'St6G9qLfkZIkVzDBtLXYJ2g397oEOG4n',
});
let currentTaskId = ""
/***
 *  云上传方法
 * fileData 上传文件数据 file
 * callBack 上传进度的回调方法
 * callBack2 上传结束的回调方法
 */
export const uploadCOSFile = (fileData = null, callBack = () => {}, callBack2 = () => {}) => {
	let directory = "library/"
	cos.uploadFile({
		Bucket: 'omm-1259568603',
		/* 桶名 必须 */
		Region: 'ap-nanjing',
		/* 存储桶所在地域，必须字段 */
		Key: directory + fileData.name,
		/* 必须 */
		Body: fileData,
		/* 必须 */
		SliceSize: 1024 * 1024 * 5,
		/* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */
		onTaskReady: function (taskId) {
			/* 非必须 */
			currentTaskId = taskId
		},
		onProgress: function (progressData) { //文件上传进度
			callBack(progressData)
		},
		onFileFinish: function (err, data, options) { //文件上传结束
			callBack2(err, data)
		},
	}, function (err, data) {
		// console.log(err || data);
	});
}
// export const closeCOSFile = (fileData) => {
//     console.log("上传终止")
// 	let directory = "library/"
// 	cos.multipartAbort({
// 		Bucket: 'omm-1259568603',
// 		/* 桶名 必须 */
// 		Region: 'ap-nanjing',
// 		/* 存储桶所在地域，必须字段 */
// 		Key: directory + fileData.name,
// 		/* 必须 */
// 		UploadId: currentTaskId /* 必须 */
// 	}, function (err, data) {
// 		console.log(err || data);
// 	})
// }