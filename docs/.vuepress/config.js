const path = require("path");

module.exports = {
  title: "Peyton 的博客",
  description: "个人博客",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],

  evergreen: true,

  plugins: [
    [
      "@vuepress/google-analytics",
      {
        ga: "UA-165839722-1",
      },
    ],
  ],

  theme: path.resolve(__dirname, "../../index.js"),
  themeConfig: {
    title: "Peyton Blog",

    // aside personInfo
    personalInfo: {
      name: "peyton",
      avatar: "/peyton.jpg",
      headerBackgroundImg: "/home-bg.jpeg",
      description:
        "climb the top of the mountain,<br/>don't stand at the foot<br/>有志登山顶，无志站山脚",
      email: "peytonpeng1990@163.com",
      location: "Shanghai, China",
      phonenumber: "15052851735",
      // organization: '不知名某公司',
    },
    // Nav link
    nav: [
      { text: "HOME", link: "/" },
      { text: "ABOUT", link: "/about/" },
      { text: "TAGS", link: "/tags/" },
    ],
    header: {
      home: {
        title: "Peyton Blog",
        subtitle: "TODO跨越知道和做到的鸿沟",
        headerImage: "/avatar-bg.jpeg",
      },
      tags: {
        title: "Tags",
        subtitle: "遇见你花光了我所有的运气",
        headerImage: "/tags-bg.jpg",
      },
      postHeaderImg: "/post-bg.jpeg",
    },
    // footer sns
    sns: {
      juejin: {
        account: "juejin",
        link: "https://juejin.cn/user/1820446983193261",
      },
      mayun: {
        account: "mayun",
        link: "https://gitee.com/pengpenghaode",
      },
      github: {
        account: "github",
        link: "https://github.com/BigPengZai",
      },
    },
    // footer github button
    footer: {
      gitbtn: {
        repository:
          "https://ghbtns.com/github-btn.html?user=BigPengZai&repo=vuepress-theme-peyton&type=star&count=false",
        frameborder: 0,
        scrolling: 0,
        width: "80px",
        height: "20px",
      },
      custom: `Copyright &copy; Peyton Blog 2020 <br />
        Theme By <a href='https://www.vuepress.cn/' target='_blank'>VuePress</a>
        | <a href='https://github.com/BigPengZai/' target='_blank'>peyton</a>`,
    },
    pagination: {
      perPage: 5,
    },

    comments: {
      owner: "peyton",
      repo: "vuepress-theme-peyton",
      clientId: "d821e5499c1d72a78039",
      clientSecret: "7aee0783e9d4110041e604e7121b985655a49cf1",
      autoCreateIssue: true,
    },
  },
};
