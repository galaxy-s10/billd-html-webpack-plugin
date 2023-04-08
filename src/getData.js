import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

import { version as BilldHtmlWebpackPluginVersion } from '../package.json';
import { errorLog } from './utils';

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
  nodeVersion: '',
};

const templateStr = `
;(function(){
var log = function (title, value) {
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
log('node版本:', {nodeVersion});
log('最后构建日期:', {lastBuildDate});
log('Powered by:', 'billd-html-webpack-plugin v${BilldHtmlWebpackPluginVersion}');
log('billd-html-webpack-plugin:', 'https://www.npmjs.com/package/billd-html-webpack-plugin');
})();
`;

const cmdMap = {
  commitSubject: 'git show -s --format=%s',
  commitBranch: 'git branch --show-current',
  committerDate: 'git show -s --format=%ci',
  commitHash: 'git show -s --format=%H',
  committerName: 'git show -s --format=%cn',
  committerEmail: 'git show -s --format=%ce',
  nodeVersion: 'node -v',
};

function updateDefaultLogData() {
  // https://git-scm.com/docs/git-show
  try {
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
    Object.keys(cmdMap).forEach((key) => {
      try {
        defaultLogData[key] = execSync(cmdMap[key]).toString().trim();
      } catch (error) {
        errorLog(error);
      }
    });
  } catch (error) {
    errorLog(error);
  }
}

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
