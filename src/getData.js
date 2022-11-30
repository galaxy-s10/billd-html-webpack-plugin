import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

import { version as BilldHtmlWebpackPluginVersion } from '../package.json';

let commitHash;
let commitUserName;
let commitDate;
let commitMessage;
let pkg = {
  name: '',
  version: '',
  repository: '',
};

try {
  // commit哈希
  commitHash = execSync('git show -s --format=%H').toString().trim();
  // commit用户名
  commitUserName = execSync('git show -s --format=%cn').toString().trim();
  // commit日期
  commitDate = new Date(
    execSync(`git show -s --format=%cd`).toString()
  ).toLocaleString();
  // commit消息
  commitMessage = execSync('git show -s --format=%s').toString().trim();
} catch (error) {
  console.log(error);
}

try {
  pkg = JSON.parse(
    readFileSync(path.join(process.cwd(), 'package.json')).toString()
  );
} catch (error) {
  console.log(error);
}

const pkgName = pkg.name;
const pkgVersion = pkg.version;
const pkgRepository =
  typeof pkg.repository === 'object' ? pkg.repository.url : pkg.repository;

const templateStr = `
;(function(){
var log = (title, value) => {
  console.log(
    '%c ' + title + ' %c ' + value + ' ' + '%c',
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent'
  );
};

log('项目名称:', {pkgName});
log('项目版本:', {pkgVersion});
log('项目仓库:', {pkgRepository});
log('最后构建:', {lastBuild});
log('git提交用户:', {commitUserName});
log('git提交日期:', {commitDate});
log('git提交信息:', {commitMessage});
log('git提交哈希:', {commitHash});
log('Powered by:', 'billd-html-webpack-plugin v${BilldHtmlWebpackPluginVersion}');
log('billd-html-webpack-plugin:', 'https://www.npmjs.com/package/billd-html-webpack-plugin');
})();
`;

const replaceKeyFromValue = (str, obj) => {
  let res = str;
  Object.keys(obj).forEach((v) => {
    res = res.replace(new RegExp(`{${v}}`, 'ig'), obj[v]);
  });
  return res;
};

export const info = replaceKeyFromValue(templateStr.toString(), {
  pkgName: JSON.stringify(pkgName),
  pkgVersion: JSON.stringify(pkgVersion),
  pkgRepository: JSON.stringify(pkgRepository),
  lastBuild: JSON.stringify(new Date().toLocaleString()),
  commitDate: JSON.stringify(commitDate),
  commitHash: JSON.stringify(commitHash),
  commitMessage: JSON.stringify(commitMessage),
  commitUserName: JSON.stringify(commitUserName),
});
