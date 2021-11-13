// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown');
const licenses = require('./licenses.js');



// TODO: Create an array of questions for user input
const questions = [
  {
    type: 'input',
    message: 'Project Title:',
    name: 'title',
    default: 'Project Title',
  },
  {
    type: 'input',
    message: 'Author Name: ',
    name: 'author',
    default: 'Anonymous'
  },
  {
    type: 'input',
    message: 'Github Username: ',
    name: 'github',
    default: '',
  },
  {
    type: 'input',
    message: 'Email Address:',
    name: 'email',
    default: '',
  },
  {
    type: 'input',
    message: 'Project Description: ',
    name: 'desc',
    default: 'Insert a Project Description.',
  },
  {
    type: 'input',
    message: 'How is this project installed?',
    name: 'install',
    default: ''
  },
  {
    type: 'input',
    message: 'How is this project used? (respond "code" to enter detailed instructions)',
    name: 'usage',
    default: ''
  },
  {
    type: 'editor',
    message: "Input detailed usage instructions. Surround code snippets with {{ }}.",
    name: 'detailUsage',
    default: '',
    when: (answers) => answers.usage === 'code'
  },
  {
    type: 'input',
    message: 'How is this project tested? (respond "code" to enter detailed tests)',
    name: 'test',
    default: ''
  },
  {
    type: 'editor',
    message: "Input detailed tests. Surround code snippets with {{ }}.",
    name: 'detailTest',
    when: (answers) => answers.test === 'code'
  },
  {
    type: 'input',
    message: 'How to contribute?',
    name: 'contribute',
    default: '',
  },
  {
    type: 'list',
    message: 'Choose a License:',
    name: 'license',
    choices: ['MIT','Apache','Mozilla','GNU','Boost','Unlicense','None'],
  },
  

];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {

  let readmeText = readmeTemplate(data);

  // filename should be a valid README.md every time, no validation required
  fs.writeFile(fileName,readmeText,(err) => {
    console.log(err)
  })

}

// Function to implement readme template into a string literal
function readmeTemplate(data) {
  let readmeText = 
`# ${data.title}

## Description

${data.desc}

${data.license!='None'?`![License Badge](https://img.shields.io/badge/License-${data.license}-informational?logoColor=white&color=1CA2F1)`:''}

## Table of Contents

${generateToc(data)}
${optionalBlock('Installation',data.install)}${optionalBlock('How to Use',(data.detailUsage)?renderCode(data.detailUsage):data.usage)}${optionalBlock('How to Contribute',data.contribute)}${optionalBlock('Tests',(data.detailTest)?renderCode(data.detailTest):data.test)}

${(data.github || data.email)?'## Questions\n':''}
${(data.github)?`Find my other projects at: [${data.github}](https://github.com/${data.github})\n`:''}
${(data.email)?`Contact me at: ${data.email}`:''}

${data.license!='None'?`## License \n${data.license!='None'?`![License Badge](https://img.shields.io/badge/License-${data.license}-informational?logoColor=white&color=1CA2F1)`:''}

This project is covered under the following license:

${licenses.lic[data.license]}`:''}

`;

  return readmeText

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
    console.log(newText.length)
  }
}

return newText.join('\n')

}

// Condensed template for Table of Contents that handles spacing and logic
// Generate only valid sections in the table of contents
function generateToc(data) {
  return `${data.install?'- [Installation](#installation)\n':''}${data.usage?'- [How to Use](#how-to-use)\n':''}${data.contribute?'- [How to Contribute](#how-to-contribute)\n':''}${data.tests || data.detailTest?'- [Tests](#testing)\n':''}${data.github || data.email?'- [Questions](#questions)\n':''}${data.license?'- [License](#license)\n':''}`
}

// Initialization function when called by Node
function init() {

  inquirer.prompt(questions)
    .then((data) => {
      let filename = 'genREADME.md';
      writeToFile(filename,data);
    })
    .catch((err) => {
      console.log('Error Occured: ')
      console.log(err)
    })


}

// Function call to initialize app
init();
