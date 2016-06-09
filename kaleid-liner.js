/*
 * kaleid-liner: Sets up HTML code to support line numbering through CSS.
 */

// Imports
var fs = require("fs");
var flags = require("flags");

// Define command-line flags
flags.defineMultiString("file").setDescription("An input filename. Each file must be specified with its own 'file' flag.");
flags.defineBoolean("css").setDescription("When TRUE, includes a CSS snippet for demonstration.");
flags.defineString("preClass").setDescription("The CSS class to be used for <pre> elements.");
flags.defineString("codeClass").setDescription("The CSS class to be used for <code> elements.");

flags.parse();

// CSS markup for line numbering
var cssMarkup = "<style>\npre\n{\n  counter-reset: line;\n}\n\ncode\n{\n  counter-increment: line;\n}\n\ncode:before\n{\n  display: inline-block;\n  content: counter(line);\n  -webkit-user-select: none;\n  width: 30px;\n}\n</style>\n"

// Create CSS classes.
function createCSSClass(name)
{
	return name === undefined ? "" : " class=\""+name+"\"";
}

var preClass = createCSSClass(flags.get("preClass"));
var codeClass = createCSSClass(flags.get("codeClass"));

// Loop through each input file
flags.get("file").forEach(function(fileName)
{
	// Get input filename from command-line args
	var inputFileName = fileName;

	// Read data from the file
	var inputData = fs.readFileSync(inputFileName).toString();
	var lines = inputData.split("\n");

	// Generate output data
	var outputData = "<pre" + preClass + ">\n"; // Open tags

	lines.forEach(function(line)
	{
		var outputLine = "<code" + codeClass + ">" + line.replace(/(\r\n|\n|\r)/gm,"").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + "</code>\n"; // Escape HTML tags.
		outputData += outputLine;
	});

	outputData += "</pre>"; // close tags

	// Write output data to file
	fs.writeFile(inputFileName + ".html", 
		(flags.get("css") ? cssMarkup + "\n" : "") + outputData, 
		function(err)
		{
			if(err)
			{
				return console.error(err);
			}
			console.log("kaleid-liner: HTML generated for " + inputFileName + " successfully.")
		});
});

