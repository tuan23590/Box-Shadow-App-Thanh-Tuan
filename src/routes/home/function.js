export const generateUniqueId = () =>
    `${Date.now()}-${Math.floor(Math.random() * 1000)}`;


export const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`
  };

  export const generateBoxShadow = ({
    shiftRight,
    shiftDown,
    blur,
    spread,
    opacity,
    inset,
    color,
  }) => {
    const convertOpacity = opacity / 100;
    return `${
      inset ? "inset " : ""
    }${shiftRight}px ${shiftDown}px ${blur}px ${spread}px rgba(${hexToRgb(
      color
    )}, ${convertOpacity})`;
  };