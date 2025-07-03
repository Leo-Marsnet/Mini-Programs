/* eslint-disable */
// 构建脚本 - 使用CommonJS语法
const path = require('path');
const fs = require('fs');
const ci = require('miniprogram-ci');
const packageJson = require('../package.json');

const privateKeyPath = path.resolve(__dirname, './key');

// 检查私钥文件是否已存在
if (!fs.existsSync(privateKeyPath)) {
  const privateKeyContent = process.env.WX_PRIVATE_KEY;
  if (!privateKeyContent) {
    throw new Error('未找到私钥内容，请确保已正确配置 GitHub Secrets');
  }
  console.log('>>>>写入私钥文件：', privateKeyPath);
  fs.writeFileSync(privateKeyPath, privateKeyContent);
}

const project = new ci.Project({
  appid: 'wxe5f52902cf4de896',
  type: 'miniProgram',
  projectPath: path.resolve(__dirname, '../'),
  privateKeyPath: path.resolve(__dirname, './key'),
  ignores: [path.resolve(__dirname, '../miniprogram/node_modules/**/*')],
});

const robotNumber = 2;
const params = {
  onProgressUpdate: console.log,
  robot: robotNumber,
  version: packageJson.version,
  desc: packageJson.bundleDescription,
  setting: {
    es7: true,
    minifyJS: true,
    minifyWXML: true,
    minifyWXSS: true,
    codeProtect: false,
    autoPrefixWXSS: true,
    ignoreUploadUnusedFiles: true,
  },
};

(async () => {
  try {
    await ci.packNpm(project, {});
    const res = await ci.upload({
      project,
      ...params,
    });
    console.debug('>>>>upload res', res);
  } catch (err) {
    console.error('>>>>upload error', err);
    throw err;
  } finally {
    // 删除临时私钥文件
    if (fs.existsSync(privateKeyPath)) {
      fs.unlinkSync(privateKeyPath);
    }
  }
})();


