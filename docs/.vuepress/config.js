// .vuepress/config.js
module.exports = {
    base: '/effective-java-study/', // base url을 설정합니다.
    title: 'Effective Java Study',
    //    head: [['link', { rel: 'icon', href: 'img.png' }]], // html head에 넣을 값들을 설정할 수 있습니다.
    themeConfig: {
        // VuePress 기본 테마에 필요한 설정을을 추가합니다.
        //logo: '/vue.png', // title옆에 나타날 로고 이미지
        sidebar: [
            '/',
            '/chapter02/',
            '/chapter03/',
            '/chapter04/',
            '/chapter05/',
            '/chapter06/',
            '/chapter07/',
            '/chapter10/',
            '/chapter11/',
            '/chapter12/',
        ],
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Sample', link: '/sample.html' },
        ],
    },
};
