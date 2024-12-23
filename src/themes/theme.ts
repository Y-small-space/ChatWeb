export const themes = {
  light: {
    colors: {
      primary: '#1890ff',
      background: '#ffffff',
      secondaryBackground: '#f5f5f5',
      text: '#000000',
      secondaryText: '#666666',
      border: '#f0f0f0',
      messageOwn: '#1890ff',
      messageOwnText: '#ffffff',
      messageOther: '#f5f5f5',
      messageOtherText: '#333333',
      hover: '#f5f5f5',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  dark: {
    colors: {
      primary: '#177ddc',
      background: '#141414',
      secondaryBackground: '#1f1f1f',
      text: '#ffffff',
      secondaryText: '#999999',
      border: '#303030',
      messageOwn: '#177ddc',
      messageOwnText: '#ffffff',
      messageOther: '#1f1f1f',
      messageOtherText: '#ffffff',
      hover: '#1f1f1f',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
    },
  },
};

export type ThemeMode = keyof typeof themes; 