export interface BilldHtmlWebpackPluginOption {
  env:
    | 'nuxt2'
    | 'nuxt3'
    | 'nuxt3-6'
    | 'vuecli4'
    | 'vuecli5'
    | 'webpack4'
    | 'webpack5'
    | 'next12'
    | 'vite4';
  log?: {
    pkgName: boolean;
    pkgVersion: boolean;
    pkgRepository: boolean;
    commitSubject: boolean;
    commitBranch: boolean;
    committerDate: boolean;
    commitHash: boolean;
    committerName: boolean;
    committerEmail: boolean;
    lastBuildDate: boolean;
    nodeVersion: boolean;
  };
  NODE_ENV?: string;
}
