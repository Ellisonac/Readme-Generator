// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown');

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
  },
  {
    type: 'input',
    message: 'Email Address:',
    name: 'email',
  },
  {
    type: 'input',
    message: 'Project Description: ',
    name: 'desc',
  },
  {
    type: 'input',
    message: 'How is this project installed?',
    name: 'install',
  },
  {
    type: 'input',
    message: 'How is this project used? (respond "code" to enter detailed instructions)',
    name: 'usage',
  },
  {
    type: 'editor',
    message: "Input detailed usage instructions. Surround code snippets with {{ }}.",
    name: 'detailUsage',
    when: (answers) => answers.usage === 'code'
  },
  {
    type: 'input',
    message: 'How is this project tested? (respond "code" to enter detailed tests)',
    name: 'test',
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

  let readmeText = generateMarkdown(data);

  // filename should be a valid README.md every time, no validation required
  fs.writeFile(fileName,readmeText,(err) => {
    console.log(err)
  })

}

// Initialization function when called by Node
function init() {

  //Start inquirer session
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
