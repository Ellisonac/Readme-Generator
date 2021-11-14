// Loading full text of licenses as stored in licenses.js
const licenses = require('./licenses.js');

// Function to implement readme template into a string literal
function generateMarkdown(data) {
  let readmeText = 
`# ${data.title}

## Description

${data.desc}

${licenseBadge(data.license)}

## Table of Contents

${generateToc(data)}
${optionalBlock('Installation',data.install)}${optionalBlock('How to Use',(data.detailUsage)?renderCode(data.detailUsage):data.usage)}${optionalBlock('How to Contribute',data.contribute)}${optionalBlock('Tests',(data.detailTest)?renderCode(data.detailTest):data.test)}

${(data.github || data.email)?'## Questions\n':''}
${(data.github)?`Find my other projects at: [${data.github}](https://github.com/${data.github})\n`:''}
${(data.email)?`Contact me at: ${data.email}`:''}

${data.license!='None'?`## License \n${licenseBadge(data.license)}

This project is covered under the following license:

${licenses.lic[data.license]}`:''}

`;

  return readmeText

}

function licenseBadge(license) {
  return (license!='None')?`![License Badge](https://img.shields.io/badge/License-${license}-informational?logoColor=white&color=1CA2F1)`:'';
}

// Helper function to render optional blocks only if response provided.
function optionalBlock(title,text) {

  if (text === '') {
    return ''
  } else {
    blockText = 
`
## ${title}

${text}

`
    return blockText
  }
  
}

// Helper function to render input code blocks to readme syntax
// Code function assumes code will be written in javascript
function renderCode(code) {

// Match text within double braces, allowing for single brace groups
const re = /{{(([^}][^}]?|[^}]}?)*)}}/g;
let matches = code.match(re);
let newText = code.split(re);

// Remove erroneous '\n' elements created by regex split
newText = newText.filter((el) => {
  return !(el==='\n')
})

// Change code blocks into README code style
if (matches) {
  for (const [index,match] of matches.entries()) {
    let matchText = match.replace(/{{/ , '```javascript\n')
    matchText = matchText.replace(/}}/ , '\n```\n')

    newText[(index*2)+1] = matchText
  }
}

return newText.join('\n')

}

// Condensed template for Table of Contents that handles spacing and logic
// Generate only valid sections in the table of contents
function generateToc(data) {
  return `${data.install?'- [Installation](#installation)\n':''}${data.usage?'- [How to Use](#how-to-use)\n':''}${data.contribute?'- [How to Contribute](#how-to-contribute)\n':''}${data.tests || data.detailTest?'- [Tests](#testing)\n':''}${data.github || data.email?'- [Questions](#questions)\n':''}${data.license?'- [License](#license)\n':''}`
}

module.exports = generateMarkdown;
