# Bible Code tools

This package contains a set of tools to explore the Bible code.
These tools are inspired from the work done on the subject by [Gérard Charton](http://gerard.charton.pagesperso-orange.fr/) (and other people before him).
The idea is to find coded words in the Bible by taking one letter every n-th letters in the original hebrew text.

## Extracting the Bible

The tools provided in this package allows to extract the Bible text from one of the compatible source formats and to produce a set of text files containing only the text, one verse per line, after removing punctuation and vowels.

Here is the list of websites providing the Bible in Hebrew in a downloadable compatible format:

* [**Mechon Mamre**](http://www.mechon-mamre.org/) From this website, the following downloadable zip files are compatible::
	* [Hebrew without vowels - masoretic spelling](http://www.mechon-mamre.org/dlx.htm)
	* [Hebrew without vowels - full spelling](http://www.mechon-mamre.org/dlk.htm)
* [**The Unbound Bible**](http://unbound.biola.edu/) From this website, go the downloads section, and choose one of the following versions (other versions may be compatible as well):
	* Hebrew OT: Westminster Leningrad Codex
	* Hebrew OT: Aleppo Codex
	* Hebrew OT: BHS (Consonants Only)
* [**La Bible multilingue (Visionneuse)**](http://visionneuse.free.fr) From this website, go to the [download section](http://visionneuse.free.fr/download.htm), and choose the original Bible text zip file.

The Hebrew text from those different sources is not exactly identical, so it is recommended to use several of them and to compare.

Once you downloaded one of the corresponding zip files, use the following command to extract its content:

	extractBible -f [format] -i [zip-source] -o [output-directory]

Here are some examples:

	extractBible -f Mechon-Mamre -i ./k001.zip -o ./k001
	extractBible -f Mechon-Mamre -i ./x001.zip -o ./x001
	extractBible -f Unbound-Bible -i ./wlc.zip -o ./wlc
	extractBible -f Unbound-Bible -i ./aleppo.zip -o ./aleppo
	extractBible -f Unbound-Bible -i ./hebrew_bhs_consonants.zip -o ./bhs
	extractBible -f Visionneuse -i ./hebreu-grec.zip -o ./visionneuse

The output directory must not already exist (but its parent directory must exist).

After the extraction, the output directory contains two files per Bible book:

* one with the ``.src.txt`` extension containing the text in the original format (no processing)
* one with the ``.out.txt`` extension containing the text after processing, one verse per line

Some options available on the ``extractBible`` tool to control the processing. To have the complete list of available options, you can use the following command:

	extractBible --help
