module.exports = {
  title: 'Ledokku',
  tagline: 'Beautiful web UI for all things Dokku',
  url: 'https://www.ledokku.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'ledokku', // Usually your GitHub org/user name.
  projectName: 'ledokku', // Usually your repo name.
  themeConfig: {
    fathomAnalytics: {
      siteId: 'AFIEKRUK',
    },
    image: 'img/twitterCardImage.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    navbar: {
      title: 'Ledokku',
      items: [
        {
          to: 'docs/introduction',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/ledokku/ledokku',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/introduction',
            },
            {
              label: 'Getting started',
              to: 'docs/getting-started',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/ledokku',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/v76vY2YaKp',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ledokku/ledokku',
            },
          ],
        },
        {
          title: 'Hosted on',
          items: [{ label: 'Netlify', href: 'https://www.netlify.com/' }],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ledokku.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/ledokku/ledokku/edit/master/website/',
        },
        blog: {
          editUrl:
            'https://github.com/ledokku/ledokku/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [require.resolve('docusaurus-plugin-fathom')],
};
