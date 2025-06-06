/* global console */
/**
 * Module dependencies.
 */
import valueParser from 'postcss-value-parser';
import rgbToHex from 'rgb-hex';

/**
 * Calculate the color of a chanel
 * based upon two 0-255 colors and a 0-1 alpha value
 *
 * @param {number} backgroundColor
 * @param {number} foregroundColor
 * @param {number} alpha
 * @return {number}
 */
function calcChannel(backgroundColor, foregroundColor, alpha) {
  const value = backgroundColor + (foregroundColor - backgroundColor) * alpha;
  return Math.round(value);
}

/**
 * Given a solid rgb background and a rgba foreground color
 * it calculates the color of the values combined into a single rgb array
 * If there is no background color
 *   strips off the alpha value from the foreground
 * @param {number[]} backgroundColor
 * @param {number[]} foregroundColor
 *
 * @return {number[]}
 */
function calculateRGB(backgroundColor, foregroundColor) {
  if (backgroundColor) {
    return [
      calcChannel(backgroundColor[0], foregroundColor[0], foregroundColor[3]),
      calcChannel(backgroundColor[1], foregroundColor[1], foregroundColor[3]),
      calcChannel(backgroundColor[2], foregroundColor[2], foregroundColor[3]),
    ];
  }

  return [foregroundColor[0], foregroundColor[1], foregroundColor[2]];
}

/**
 * PostCSS plugin to transform rgba() to hexadecimal
 */
const plugin = (options = {}) => {
  const properties = options.properties || ['background-color', 'background', 'color', 'border', 'border-color', 'outline', 'outline-color'];
  const backgroundColor = options.backgroundColor || null;

  const visited = new WeakSet();

  return {
    postcssPlugin: 'postcss-color-rgba-fallback',
    Declaration(declaration) {
      if (visited.has(declaration)) {
        return;
      }

      if (!declaration.value || declaration.value.indexOf('rgba') === -1 || properties.indexOf(declaration.prop) === -1) {
        visited.add(declaration);
        return;
      }

      // if previous prop equals current prop
      // no need fallback
      if (declaration.prev() && declaration.prev()?.prop === declaration.prop) {
        visited.add(declaration);
        return;
      }

      let hex;
      let alpha;
      const value = valueParser(declaration.value)
        .walk(function (node) {
          const { nodes } = node;
          if (node.type === 'function' && node.value === 'rgba') {
            try {
              alpha = parseFloat(nodes[6].value);

              const RGB = calculateRGB(backgroundColor, [parseInt(nodes[0].value, 10), parseInt(nodes[2].value, 10), parseInt(nodes[4].value, 10), alpha]);
              hex = rgbToHex.apply(null, RGB);

              node.type = 'word';
              node.value = '#' + hex;
            } catch (e) {
              console.error(e);

              return false;
            }

            return false;
          }
        })
        .toString();

      if (value !== declaration.value) {
        declaration.cloneBefore({ value: value });
      }

      visited.add(declaration);
    },
  };
};

plugin.postcss = true;

export default plugin;
