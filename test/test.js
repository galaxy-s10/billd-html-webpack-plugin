(function () {
  try {
    const log = function (title, value) {
      console.log(
        `%c ${title} %c ${value} ` + `%c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent'
      );
    };

    log('pkg名称:', { pkgName });
    log('pkg版本:', { pkgVersion });
    log('pkg仓库:', { pkgRepository });
    log('git提交主题:', { commitSubject });
    log('git提交分支:', { commitBranch });
    log('git提交日期:', { committerDate });
    log('git提交哈希:', { commitHash });
    log('git提交者名字:', { committerName });
    log('git提交者邮箱:', { committerEmail });
    log('node版本:', { nodeVersion });
    log('最后构建日期:', { lastBuildDate });
    log(
      'Powered by:',
      'billd-html-webpack-plugin v${BilldHtmlWebpackPluginVersion}'
    );
    log(
      'billd-html-webpack-plugin:',
      'https://www.npmjs.com/package/billd-html-webpack-plugin'
    );
  } catch (error) {
    console.log(error);
  }
})();
