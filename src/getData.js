import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

import { version as BilldHtmlWebpackPluginVersion } from '../package.json';

let commitHash;
let commitBranch;
let committerName;
let committerEmail;
let committerDate;
let commitSubject;
let pkg = {
  name: '',
  version: '',
  repository: '',
};

// https://git-scm.com/docs/git-show
try {
  // commit hash
  commitHash = execSync('git show -s --format=%H').toString().trim();
  // commit branch
  commitBranch = execSync('git branch --show-current').toString().trim();
  // committer name
  committerName = execSync('git show -s --format=%cn').toString().trim();
  // committer email
  committerEmail = execSync('git show -s --format=%ce').toString().trim();
  // committer date
  committerDate = execSync(`git show -s --format=%ci`).toString().trim();
  // subject
  commitSubject = execSync('git show -s --format=%s').toString().trim();
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
  // @ts-ignore
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

log('pkg名称:', {pkgName});
log('pkg版本:', {pkgVersion});
log('pkg仓库:', {pkgRepository});
log('git提交主题:', {commitSubject});
log('git提交分支:', {commitBranch});
log('git提交日期:', {committerDate});
log('git提交哈希:', {commitHash});
log('git提交者名字:', {committerName});
log('git提交者邮箱:', {committerEmail});
log('最后构建日期:', {lastBuildDate});
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

const defaultLogData = {
  pkgName,
  pkgVersion,
  pkgRepository,
  commitSubject,
  commitBranch,
  committerDate,
  commitHash,
  committerName,
  committerEmail,
  lastBuildDate: new Date().toLocaleString(),
};

export const logData = (log) => {
  const tmpData = JSON.parse(JSON.stringify(defaultLogData));
  if (log) {
    Object.keys(tmpData).forEach((item) => {
      tmpData[item] = log[item] === false ? '-' : tmpData[item];
    });
  }
  return tmpData;
};

export const logInfo = (log) => {
  const tmpData = JSON.parse(JSON.stringify(defaultLogData));
  if (log) {
    Object.keys(tmpData).forEach((item) => {
      tmpData[item] =
        log[item] === false
          ? JSON.stringify('-')
          : JSON.stringify(tmpData[item]);
    });
  }
  return replaceKeyFromValue(templateStr.toString(), tmpData);
};
