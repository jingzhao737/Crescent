var fs = require('fs');
var code = fs.readFileSync('C:/Users/jackchen/lobsterai/project/portfolio-demo/js/modules/hanging-circles.js','utf8');
// Check for basic syntax: count braces
var open = (code.match(/\{/g) || []).length;
var close = (code.match(/\}/g) || []).length;
console.log('braces:', open, 'opens,', close, 'closes');
// Check for windActive references
var wa = code.match(/windActive/g);
console.log('windActive refs:', wa ? wa.length : 0);
// Check lines around the wind sequencer
var lines = code.split('\n');
for (var i = 0; i < lines.length; i++) {
  if (lines[i].includes('windActive') || lines[i].includes('Wind sequencer')) {
    console.log('L' + (i+1) + ':', lines[i].trim());
  }
}
