/***
 *  资料库--腾讯云 上传方法
 * @auth yyp
 */

import {
	message
} from '_antd@3.26.20@antd';

let COS = require('cos-js-sdk-v5');
let cos = new COS({
	SecretId: 'AKIDZZOwINWfQ6jqjnOqWy93OWaYGm0Co2iR',
	SecretKey: 'St6G9qLfkZIkVzDBtLXYJ2g397oEOG4n',
});
let directory = "library/"
/***
 *  腾讯云 文件上传方法
 * fileData 上传文件数据 file
 * getID 获取任务id
 * getProgress 获取上传进度
 * onFinish   上传结束的回调方法
 */
export const UploadCOSFile = (fileData = null, getID = () => {}, getProgress = () => {}, onFinish = () => {}) => {
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
			getID(taskId)
		},
		onProgress: function (progressData) { //文件上传进度
			getProgress(progressData)
		},
		onFileFinish: function (err, data, options) { //文件上传结束
			onFinish(err, data)
		},
	}, function (err, data) {
		// console.log(err || data);
	});
}
/***
 *  腾讯云	删除方法
 * taskId 唯一标识上传任务，可用于上传任务的取消
 */
export const DelCOSFile = (fileName) => {
	console.log("删除上传文件", fileName)
	cos.deleteObject({
		Bucket: 'omm-1259568603',
		/* 桶名 必须 */
		Region: 'ap-nanjing',
		/* 存储桶所在地域，必须字段 */
		Key: directory + fileName,
	}, function (err, data) {
		console.log(err || data);
	});
}

/***
 *  腾讯云	暂停上传方法
 * taskId 唯一标识上传任务，可用于上传任务的取消
 */
export const PauseCOSFile = (taskId) => {
	// console.log("暂停上传")
	cos.pauseTask(taskId)
}
/***
 *  腾讯云	取消上传方法
 * taskId 唯一标识上传任务，可用于上传任务的取消
 */
export const CancelCOSFile = (taskId) => {
	// console.log("取消上传")
	cos.cancelTask(taskId)
}

/***
 *  腾讯云 重新上传方法
 * taskId 唯一标识上传任务，可用于上传任务的取消
 */
export const RestartCOSFile = (taskId) => {
	// console.log("续传开始")
	cos.restartTask(taskId)
}

/***
 *  腾讯云 获取已上传文件列表
 * 
 */
export const GetFileList = () => {
	cos.getBucket({
		Bucket: 'omm-1259568603',
		/* 桶名 必须 */
		Region: 'ap-nanjing',
		Prefix: directory,
		/* 非必须 */
	}, function (err, data) {
		console.log(err || data.Contents);
	});
}

/***
 *  腾讯云 下载文件
 *  name  要下载的文件名称
 */
export const GetCOSFile = (name) => {
	cos.headObject({
		Bucket: 'omm-1259568603',
		/* 桶名 必须 */
		Region: 'ap-nanjing',
		/* 存储桶所在地域，必须字段 */
		Key: directory + name,
	}, function (err, data) {
		if (err) {
			message.destroy()
			message.error("文件不存在！")
		} else {
			cos.getObjectUrl({
				Bucket: 'omm-1259568603',
				/* 桶名 必须 */
				Region: 'ap-nanjing',
				/* 存储桶所在地域，必须字段 */
				Key: directory + name,
				Expires: 60,
				Sign: true,
			}, function (err, data) {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.href = data.Url + (data.Url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment';
				a.click();
				document.body.removeChild(a);
			});
		}
	});


}