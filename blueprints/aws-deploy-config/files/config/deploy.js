/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    pipeline: {
      activateOnDeploy: true
    },
    s3: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      filePattern: "*"
    },
    cloudfront: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET
    }
  };

  ENV['revision-data'] = {
    // type: The type of Data Generator to be used.
    // Default: 'file-hash' Alternatives: 'git-tag-commit', 'git-commit', 'version-commit'
    // https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data#type
    type: 'file-hash'
  }

  switch (ENV['revision-data']['type']) {
    case 'file-hash':
      ENV['revision-data'].merge({
        filePattern: 'index.html',
        distDir: function(context) {
          return context.distDir;
        },
        distFiles: function(context) {
          return context.distFiles;
        }
      });
    case 'git-tag-commit':
      // No configurable options
    case 'git-commit':
      // No configurable options
    case 'version-commit':
      ENV['revision-data']['versionFile'] = 'package.json';
  }

  ENV.sentry {
    publicUrl: 'https://your.awesome.site',
    sentryUrl: 'https://sentry.your.awesome.site',
    sentryOrganizationSlug: 'AwesomeOrg',
    sentryProjectSlug: 'AwesomeProject',
    sentryApiKey: 'awesomeApiKey'
  };

  ENV.slack = {
    webhookURL: '<your-webhook-URI>'
  };

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    ENV.s3.bucket = process.env.STAGING_BUCKET;
    ENV.s3.region = process.env.STAGING_REGION;
    ENV.cloudfront.distribution = process.env.STAGING_DISTRIBUTION;
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV.s3.bucket = process.env.PRODUCTION_BUCKET;
    ENV.s3.region = process.env.PRODUCTION_REGION;
    ENV.cloudfront.distribution = process.env.PRODUCTION_DISTRIBUTION;
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
