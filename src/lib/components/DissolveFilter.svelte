<svg class="fx" width="0" height="0" aria-hidden="true" focusable="false">
  <filter id="theme-dissolve" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="7" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="0" result="displaced">
      <animate attributeName="scale" values="0;90" dur="0.9s" begin="indefinite" fill="freeze" />
    </feDisplacementMap>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="alpha" />
    <feComponentTransfer in="alpha" result="mask">
      <feFuncA type="linear" slope="16" intercept="1">
        <animate attributeName="intercept" values="1;-16" dur="0.9s" begin="indefinite" fill="freeze" />
      </feFuncA>
    </feComponentTransfer>
    <feComposite in="displaced" in2="mask" operator="in" />
  </filter>
</svg>

<style>
  .fx {
    position: absolute;
    width: 0;
    height: 0;
  }
</style>
