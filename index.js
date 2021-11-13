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

  // filename should be a valid README.md every time

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

${data.license!='None'?'[License Badge](https://img.shields.io/badge/License-${data.license}-informational?logoColor=white&color=1CA2F1)':''}

## Table of Contents

${generateToc(data)}
${optionalBlock('Installation',data.install)}${optionalBlock('Usage',(data.detailUsage)?renderCode(data.detailUsage):data.usage)}${optionalBlock('Contributing',data.contribute)}${optionalBlock('Tests',(data.detailTest)?renderCode(data.detailTest):data.test)}

${(data.github || data.email)?'## Questions\n':''}
${(data.github)?`Find my other projects at: [${data.github}](${data.github})\n`:''}
${(data.email)?`Contact me at: ${data.email}`:''}

## License \t![License Badge](https://img.shields.io/badge/License-${data.license}-informational?logoColor=white&color=1CA2F1)

${licenses.lic[data.license]}

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

const re = /{{([^}]+)}}/g;
let matches = code.match(re);

console.log(matches)
let newText = code.split(re);
console.log(newText)

if (matches) {
  for (const [index,match] of matches.entries()) {
    let matchText = match.replace(/{{/ , '```javascript\n')
    matchText = matchText.replace(/}}/ , '\n```\n')

    newText[(index*2)+1] = matchText

    console.log(match)
  }
}

return newText.join('\n')

}

// Condensed template for Table of Contents that handles spacing and logic
// Generate only valid sections in the table of contents
function generateToc(data) {
  return `${data.install?'- [Installation](#Installation)\n':''}${data.usage?'- [Usage](#Usage)\n':''}${data.contribute?'- [Contributing](#Contributing)\n':''}${data.tests || data.detailTest?'- [Tests](#Tests)\n':''}${data.github || data.email?'- [Questions](#Questions)\n':''}${data.license?'- [License](#License)\n':''}`
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
