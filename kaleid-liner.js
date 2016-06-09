/*
 * kaleid-liner: Sets up HTML code to support line numbering through CSS.
 *
 * Usage: node kaleid-liner.js [filename]
 */

// Imports
var fs = require("fs");

// CSS markup for line numbering
var cssMarkup = "<style>\npre\n{\n  counter-reset: line;\n}\n\ncode\n{\n  counter-increment: line;\n}\n\ncode:before\n{\n  display: inline-block;\n  content: counter(line);\n  -webkit-user-select: none;\n  width: 30px;\n}\n</style>\n"

// Get input filename from command-line args
var inputFileName = process.argv[2];

// Read data from the file
var inputData = fs.readFileSync(inputFileName).toString();
var lines = inputData.split("\n");

// Generate output data
var outputData = "<pre>\n"; // Open tags

lines.forEach(function(line)
		{
			var outputLine = "<code>" + line.replace(/(\r\n|\n|\r)/gm,"").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + "</code>\n"; // Escape HTML tags.
			outputData += outputLine;
		});

outputData += "</pre>"; // close tags

console.log(outputData);

// Write output data to file
fs.writeFile(inputFileName + ".html", cssMarkup + "\n" +  outputData, function(err)
		{
			if(err){
				return console.error(err);
			}
			console.log("kaleid-liner: HTML generated successfully.")
		});
