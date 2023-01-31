import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

import { version as BilldHtmlWebpackPluginVersion } from '../package.json';

const defaultLogData = {
  pkgName: '',
  pkgVersion: '',
  pkgRepository: '',
  commitSubject: '',
  commitBranch: '',
  committerDate: '',
  commitHash: '',
  committerName: '',
  committerEmail: '',
  lastBuildDate: new Date().toLocaleString(),
};

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

function updateDefaultLogData() {
  // https://git-scm.com/docs/git-show
  try {
    // commit hash
    defaultLogData.commitHash = execSync('git show -s --format=%H')
      .toString()
      .trim();
    // commit branch
    defaultLogData.commitBranch = execSync('git branch --show-current')
      .toString()
      .trim();
    // committer name
    defaultLogData.committerName = execSync('git show -s --format=%cn')
      .toString()
      .trim();
    // committer email
    defaultLogData.committerEmail = execSync('git show -s --format=%ce')
      .toString()
      .trim();
    // committer date
    defaultLogData.committerDate = execSync(`git show -s --format=%ci`)
      .toString()
      .trim();
    // subject
    defaultLogData.commitSubject = execSync('git show -s --format=%s')
      .toString()
      .trim();

    const pkg = JSON.parse(
      readFileSync(path.join(process.cwd(), 'package.json')).toString()
    );
    defaultLogData.pkgName = pkg?.name;
    defaultLogData.pkgVersion = pkg?.version;
    defaultLogData.pkgRepository =
      // @ts-ignore
      typeof pkg?.repository === 'object'
        ? pkg?.repository?.url
        : pkg?.repository;
  } catch (error) {
    console.log(error);
  }
}

updateDefaultLogData();

const replaceKeyFromValue = (str, obj) => {
  let res = str;
  Object.keys(obj).forEach((v) => {
    res = res.replace(new RegExp(`{${v}}`, 'ig'), obj[v]);
  });
  return res;
};

export const logData = (log) => {
  updateDefaultLogData();
  const tmpData = JSON.parse(JSON.stringify(defaultLogData));
  if (log) {
    Object.keys(tmpData).forEach((item) => {
      tmpData[item] = log[item] === false ? '-' : tmpData[item];
    });
  }
  return tmpData;
};

export const logInfo = (log) => {
  updateDefaultLogData();
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
