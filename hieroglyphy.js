;(function (global, undefined) {
/*jshint sub:true, evil:true */
    "use strict";

    var numbers,
        characters,
        functionConstructor,
        escape,
        unescape;

    numbers = [
        "+[]",
        "+!![]",
        "!+[]+!![]",
        "!+[]+!![]+!![]",
        "!+[]+!![]+!![]+!![]",
        "!+[]+!![]+!![]+!![]+!![]",
        "!+[]+!![]+!![]+!![]+!![]+!![]",
        "!+[]+!![]+!![]+!![]+!![]+!![]+!![]",
        "!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]",
        "!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]"
    ];

    characters = {
        "0" : "(" + numbers[0] + ")",
        "1" : "(" + numbers[1] + ")",
        "2" : "(" + numbers[2] + ")",
        "3" : "(" + numbers[3] + ")",
        "4" : "(" + numbers[4] + ")",
        "5" : "(" + numbers[5] + ")",
        "6" : "(" + numbers[6] + ")",
        "7" : "(" + numbers[7] + ")",
        "8" : "(" + numbers[8] + ")",
        "9" : "(" + numbers[9] + ")",
        " " : "({}+[])[!+[]+!![]+!![]+!![]+!![]+!![]+!![]]",
        "[" : "({}+[])[+[]]",
        "]" : "({}+[])[[]+ +!![]+(!+[]+!![]+!![]+!![])]",
        "+" : "(+(+!![] + (!![]+[])[!+[]+!+[]+!+[]] + +!![] + +[] + +[])+[])[" +
            "+[]+!![]+!![]]",
        "a" : "(+{}+[])[+!![]]",
        "b" : "({}+[])[!+[]+!![]]",
        "c" : "({}+[])[!+[]+!+[]+!+[]+!+[]+!+[]]",
        "d" : "([][+[]]+[])[!+[]+!![]]",
        "e" : "(!![]+[])[!+[]+!![]+!![]]",
        "f" : "([][+[]]+[])[!+[]+!![]+!![]+!![]]",
        "i" : "([][+[]]+[])[!+[]+!![]+!![]+!![]+!![]]",
        "j" : "({}+[])[!+[]+!![]+!![]]",
        "l" : "(![]+[])[+[]+!![]+!![]]",
        "n" : "([][+[]]+[])[+!![]]",
        "o" : "({}+[])[+!![]]",
        "r" : "(!![]+[])[+!![]]",
        "s" : "(![]+[])[+[]+!![]+!![]+!![]]",
        "t" : "(!![]+[])[+[]]",
        "u" : "([][+[]]+[])[+[]]",
        "y" : "(+(+!![] + (!![]+[])[!+[]+!+[]+!+[]] + +!![] + +[] + +[] + +[]" +
            ")+[])[!+[]+!![]+!![]+!![]+!![]+!![]+!![]]",
        "I" : "(+(+!![] + (!![]+[])[!+[]+!+[]+!+[]] + +!![] + +[] + +[] + +[]" +
            ")+[])[+[]]",
        "N" : "(+{}+[])[+[]]",
        "O" : "({}+[])[!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]]"
    };

    functionConstructor = "[][" + hieroglyphyString("sort") + "][" +
        hieroglyphyString("constructor") + "]";

    //Below characters need target http(s) pages
    characters["h"] = "([]+" + hieroglyphy("return location") + ")[" +
        numbers[0] + "]";
    characters["p"] = "([]+" + hieroglyphy("return location") + ")[" +
        numbers[3] + "]";
    characters["/"] = "([]+" + hieroglyphy("return location") + ")[" +
        numbers[6] + "]";

    unescape = hieroglyphy("return unescape");
    escape = hieroglyphy("return escape");

    characters["%"] = escape + "(" + hieroglyphyString("[") + ")[" +
        numbers[0] + "]";

    function getHexaString (number, digits) {
        var string = number.toString(16);

        while (string.length < digits) {
            string = "0" + string;
        }

        return string;
    }

    function getUnescapeSequence (charCode) {
        return unescape + "(" +
            hieroglyphyString("%" + getHexaString(charCode, 2)) + ")";
    }

    function getHexaSequence (charCode) {
        return hieroglyphyString("\\x" + getHexaString(charCode, 2));
    }

    function getUnicodeSequence (charCode) {
        return hieroglyphyString("\\u" + getHexaString(charCode, 4));
    }

    function hieroglyphyCharacter (char) {
        var charCode = char.charCodeAt(0),
            unescapeSequence,
            hexaSequence,
            unicodeSequence,
            shortestSequence;

        if (characters[char] !== undefined) {
            return characters[char];
        }

        if (char === "\\") {
            //This char must be handled appart becuase the others need them
            characters[char] = getUnescapeSequence(charCode);
            return characters[char];
        }

        if (charCode < 128) {
            //ASCII characters can be obtained with hexa and unscape sequences
            unescapeSequence = getUnescapeSequence(charCode);

            if (char !== "x") {
                //Hexa sequences need the x.
                hexaSequence = getHexaSequence(charCode);
            }
        }

        shortestSequence = getUnicodeSequence(charCode);

        if (hexaSequence !== undefined) {
            if (unescapeSequence.length < hexaSequence.length) {
                if (shortestSequence.length > unescapeSequence.length) {
                    shortestSequence = unescapeSequence;
                }
            } else {
                if (shortestSequence.length > hexaSequence.length) {
                    shortestSequence = hexaSequence;
                }
            }
        } else if (unescapeSequence !== undefined) {
            if (shortestSequence.length > unescapeSequence.length) {
                shortestSequence = unescapeSequence;
            }
        }

        characters[char] = shortestSequence;
        return shortestSequence;
    }

    function hieroglyphyString (str) {
        var i,
            hieroglyphiedStr = "";

        for (i = 0; i < str.length; i += 1) {

            hieroglyphiedStr += (i > 0) ? "+" : "";
            hieroglyphiedStr += hieroglyphyCharacter(str[i]);
        }

        return hieroglyphiedStr;
    }

    function hieroglyphy (src) {
        return functionConstructor + "("  + hieroglyphyString(src) + ")()";
    }

    if (global.define && global.define.amd) {
        global.define([], hieroglyphy);
    } else if (typeof exports !== "undefined") {
        module.exports = hieroglyphy;
    } else {
        global.hieroglyphy = hieroglyphy;
    }

})(this);
