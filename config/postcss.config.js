module.exports = ({ file, options, env }) => {
  let common = [
    require('postcss-cssnext')({
      warnForDuplicates: false,
      warnForDeprecations: false
    })
  ];

  if (process.env.npm_lifecycle_event === 'dev') {
      return {
          plugins: common.concat([
          ])
      };
  }

  return {
      plugins: common.concat([
        require('cssnano')({
          preset: 'advanced'
        })
      ])
  };
};
