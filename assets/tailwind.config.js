/* Bella Veganista — shared Tailwind theme.
   Colours derive from the logo: pink script, sage circle, peach heart. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink:        '#1F1A1C',
        muted:      '#6B615F',
        berry:      '#C4197A',
        'berry-dp': '#8E1257',
        sage:       '#7D9455',
        'sage-dp':  '#4E6135',
        peach:      '#F9A48B',
        cream:      '#FDFBF7',
        shell:      '#F5EFE6',
        rule:       '#E4DCD0',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Georgia', 'serif'],
        body:    ['Lora', 'Georgia', 'serif'],
        ui:      ['Jost', 'system-ui', 'sans-serif'],
      },
      maxWidth: { shell: '1180px' },
    },
  },
};
