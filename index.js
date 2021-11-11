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
    default: 'Installation instructions.'
  },
  {
    type: 'input',
    message: 'How is this project used? (respond "code" to enter detailed instructions)',
    name: 'usage',
    default: 'Usage Instructions.'
  },
  {
    type: 'editor',
    message: "Input detailed usage instructions. Surround code snippets with ''' triple quotes.",
    name: 'detailUsage',
    when: (answers) => answers.usage === 'code'
  },
  {
    type: 'input',
    message: 'How is this project tested? (respond "code" to enter detailed tests)',
    name: 'test',
    default: 'Testing Instructions.'
  },
  {
    type: 'editor',
    message: "Input detailed tests. Surround code snippets with ''' triple quotes.",
    name: 'detailTest',
    when: (answers) => answers.usage === 'code'
  },
  {
    type: 'input',
    message: 'How to contribute?',
    name: 'contribute',
    default: 'Contribution Instructions.',
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

## Table of Contents

[Installation](#Installation)  
[Usage](#Usage)  
[Contributing](#Contributing)  
[Tests](#Tests)  
[Questions](#Questions) 
[License](#License) 


## Installation

${data.install}

## Usage

${(data.detailUsage)?data.detailUsage:data.usage}

## Contributing

${data.contribute}

## Tests

${(data.detailTest)?data.detailTest:data.test}

## Questions

${(data.github)?`Find my other projects at: [${data.github}](${data.github})`:''}
Find my other projects at: [${data.github}](${data.github})
${(data.email)?`Contact me at: ${data.email}`:''}

## License   ![License Badge](https://img.shields.io/badge/License-${data.license}-informational?logoColor=white&color=1CA2F1)

${licenses.lic[data.license]}



`;

  return readmeText


}



// TODO: Create a function to initialize app
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
