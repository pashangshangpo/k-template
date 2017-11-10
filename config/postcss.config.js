module.exports = () => {
  let common = [
    require('postcss-cssnext')()
  ];

  if (process.env.NODE_ENV === 'development') {
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
