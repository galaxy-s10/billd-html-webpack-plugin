(function () {
  try {
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
