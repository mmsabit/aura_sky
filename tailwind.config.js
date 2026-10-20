/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface-tint': '#006398',
        'on-surface': '#131b2e',
        'on-tertiary-container': '#fbfdff',
        outline: '#707881',
        error: '#ba1a1a',
        'on-primary': '#ffffff',
        'on-secondary-fixed-variant': '#004c69',
        surface: '#faf8ff',
        'secondary-fixed-dim': '#7bd0ff',
        secondary: '#00668a',
        'surface-dim': '#d2d9f4',
        'tertiary-fixed': '#bee9ff',
        'inverse-on-surface': '#eef0ff',
        'on-error': '#ffffff',
        'on-primary-container': '#fdfcff',
        'on-tertiary-fixed': '#001f2a',
        'surface-container-high': '#e2e7ff',
        'on-primary-fixed-variant': '#004b73',
        'surface-container-highest': '#dae2fd',
        background: '#faf8ff',
        'secondary-fixed': '#c4e7ff',
        'surface-bright': '#faf8ff',
        'surface-container': '#eaedff',
        'surface-container-lowest': '#ffffff',
        'primary-fixed': '#cce5ff',
        'surface-variant': '#dae2fd',
        'tertiary-container': '#4f7a8e',
        'primary-container': '#007bb9',
        'on-secondary-fixed': '#001e2c',
        'inverse-surface': '#283044',
        primary: '#006194',
        'surface-container-low': '#f2f3ff',
        'on-error-container': '#93000a',
        'error-container': '#ffdad6',
        'on-secondary-container': '#004d6a',
        'on-background': '#131b2e',
        'primary-fixed-dim': '#93ccff',
        'on-primary-fixed': '#001d31',
        'outline-variant': '#bfc7d2',
        tertiary: '#366175',
        'secondary-container': '#40c2fd',
        'on-tertiary-fixed-variant': '#1e4c5f',
        'on-surface-variant': '#3f4850',
        'on-secondary': '#ffffff',
        'on-tertiary': '#ffffff',
        'tertiary-fixed-dim': '#a1cde3',
        'inverse-primary': '#93ccff'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      spacing: {
        'space-2xl': '3rem',
        'space-2xs': '0.25rem',
        'space-xs': '0.5rem',
        'space-xl': '2rem',
        'space-sm': '0.75rem',
        'space-lg': '1.5rem',
        'space-md': '1rem',
        margin: '1.25rem',
        'margin-tablet': '2rem',
        'margin-desktop': '3rem',
        'gutter-desktop': '1.5rem',
        gutter: '1.25rem'
      },
      fontFamily: {
        'headline-xl-mobile': [
          'Plus Jakarta Sans'
        ],
        'display-hero': [
          'Plus Jakarta Sans'
        ],
        'body-lg': [
          'Inter'
        ],
        'label-md': [
          'Inter'
        ],
        'body-sm': [
          'Inter'
        ],
        'headline-xl': [
          'Plus Jakarta Sans'
        ],
        'display-hero-mobile': [
          'Plus Jakarta Sans'
        ],
        'headline-md': [
          'Plus Jakarta Sans'
        ],
        'label-sm': [
          'Inter'
        ],
        'headline-lg': [
          'Plus Jakarta Sans'
        ],
        'body-md': [
          'Inter'
        ],
        'data-metric': [
          'Plus Jakarta Sans'
        ],
        'headline-sm': [
          'Plus Jakarta Sans'
        ]
      },
      fontSize: {
        'headline-xl-mobile': [
          '32px',
          {
            lineHeight: '40px',
            letterSpacing: '-0.02em',
            fontWeight: '600'
          }
        ],
        'display-hero': [
          '80px',
          {
            lineHeight: '84px',
            letterSpacing: '-0.04em',
            fontWeight: '300'
          }
        ],
        'body-lg': [
          '18px',
          {
            lineHeight: '28px',
            letterSpacing: '-0.01em',
            fontWeight: '400'
          }
        ],
        'label-md': [
          '12px',
          {
            lineHeight: '16px',
            letterSpacing: '0.04em',
            fontWeight: '500'
          }
        ],
        'body-sm': [
          '13px',
          {
            lineHeight: '18px',
            letterSpacing: '0em',
            fontWeight: '400'
          }
        ],
        'headline-xl': [
          '40px',
          {
            lineHeight: '48px',
            letterSpacing: '-0.025em',
            fontWeight: '600'
          }
        ],
        'display-hero-mobile': [
          '56px',
          {
            lineHeight: '60px',
            letterSpacing: '-0.03em',
            fontWeight: '300'
          }
        ],
        'headline-md': [
          '20px',
          {
            lineHeight: '28px',
            letterSpacing: '-0.01em',
            fontWeight: '600'
          }
        ],
        'label-sm': [
          '11px',
          {
            lineHeight: '14px',
            letterSpacing: '0.06em',
            fontWeight: '600'
          }
        ],
        'headline-lg': [
          '28px',
          {
            lineHeight: '36px',
            letterSpacing: '-0.02em',
            fontWeight: '600'
          }
        ],
        'body-md': [
          '15px',
          {
            lineHeight: '22px',
            letterSpacing: '-0.005em',
            fontWeight: '400'
          }
        ],
        'data-metric': [
          '24px',
          {
            lineHeight: '28px',
            letterSpacing: '-0.02em',
            fontWeight: '500'
          }
        ],
        'headline-sm': [
          '16px',
          {
            lineHeight: '24px',
            letterSpacing: '-0.005em',
            fontWeight: '600'
          }
        ]
      }
    }
  },
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  plugins: []
}
