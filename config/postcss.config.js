module.exports = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            plugins: [
                require('postcss-cssnext')()
            ]
        };
    }

    return {
        plugins: [
            require('postcss-cssnext')(),
            require('cssnano')({
                preset: 'advanced'
            })
        ]
    };
};