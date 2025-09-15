import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

const sharedConfig: ThemeConfig = {
  cssVar: true, // use css variables -> var(--xxx)
  hashed: false, // close hash
  token: {
    controlHeightXS: 24,
    controlHeightSM: 32,
    controlHeight: 40,
    controlHeightLG: 48,
    borderRadiusXS: 4,
    borderRadiusSM: 6,
    borderRadius: 8,
    borderRadiusLG: 12,
    colorPrimary: '#0062ff',
  },
  components: {
    Layout: {
      headerBg: 'transparent',
      headerPadding: 0,
      headerHeight: 'auto',
      footerBg: 'transparent',
      footerPadding: 0,
      bodyBg: 'transparent',
    },
    Table: {
      headerBorderRadius: 0,
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemBg: 'transparent',
    },
    Button: {
      dangerShadow: 'none',
      defaultShadow: 'none',
      primaryShadow: 'none',
      contentFontSizeSM: 12,
    },
  },
};

const lightConfig: ThemeConfig = {
  ...sharedConfig,
  algorithm: theme.defaultAlgorithm,
};

const darkConfig: ThemeConfig = {
  ...sharedConfig,
  algorithm: theme.darkAlgorithm,
};

export { darkConfig, lightConfig };
