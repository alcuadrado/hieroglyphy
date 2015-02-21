;(function (global, undefined) {
/*jshint sub:true, evil:true */
    "use strict";

    var numbers,
        _object_Object,
        _NaN,
        _true,
        _false,
        _undefined,
        _Infinity,
        _1e100,
        characters,
        functionConstructor,
        escape,
        unescape,
        locationString,
        API;

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
        "0" : "(" + numbers[0] + "+[])",
        "1" : "(" + numbers[1] + "+[])",
        "2" : "(" + numbers[2] + "+[])",
        "3" : "(" + numbers[3] + "+[])",
        "4" : "(" + numbers[4] + "+[])",
        "5" : "(" + numbers[5] + "+[])",
        "6" : "(" + numbers[6] + "+[])",
        "7" : "(" + numbers[7] + "+[])",
        "8" : "(" + numbers[8] + "+[])",
        "9" : "(" + numbers[9] + "+[])"
    };

    _object_Object = "[]+{}";
    _NaN = "+{}+[]";
    _true = "!![]+[]";
    _false = "![]+[]";
    _undefined = "[][[]]+[]";

    characters[" "] = "(" + _object_Object + ")[" + numbers[7]  + "]";
    characters["["] = "(" + _object_Object + ")[" + numbers[0]  + "]";
    characters["]"] = "(" + _object_Object + ")[" + characters[1] + "+" +
        characters[4] + "]";
    characters["a"] = "(" + _NaN + ")[" + numbers[1] + "]";
    characters["b"] = "(" + _object_Object + ")[" + numbers[2] + "]";
    characters["c"] = "(" + _object_Object + ")[" + numbers[5] + "]";
    characters["d"] = "(" + _undefined + ")[" + numbers[2] + "]";
    characters["e"] = "(" + _undefined + ")[" + numbers[3] + "]";
    characters["f"] = "(" + _false + ")[" + numbers[0] + "]";
    characters["i"] = "(" + _undefined + ")[" + numbers[5] + "]";
    characters["j"] = "(" + _object_Object + ")[" + numbers[3] + "]";
    characters["l"] = "(" + _false + ")[" + numbers[2] + "]";
    characters["n"] = "(" + _undefined + ")[" + numbers[1] + "]";
    characters["o"] = "(" + _object_Object + ")[" + numbers[1] + "]";
    characters["r"] = "(" + _true + ")[" + numbers[1] + "]";
    characters["s"] = "(" + _false + ")[" + numbers[3] + "]";
    characters["t"] = "(" + _true + ")[" + numbers[0] + "]";
    characters["u"] = "(" + _undefined + ")[" + numbers[0] +"]";
    characters["N"] = "(" + _NaN + ")[" + numbers[0] + "]";
    characters["O"] = "(" + _object_Object + ")[" + numbers[8] + "]";

    _Infinity = "+(" + numbers[1] + "+" + characters["e"] + "+" +
        characters[1] + "+" + characters[0] + "+" + characters[0] + "+" +
        characters[0] + ")+[]";

    characters["y"] = "(" + _Infinity + ")[" + numbers[7] + "]";
    characters["I"] = "(" + _Infinity + ")[" + numbers[0] + "]";

    _1e100 = "+(" + numbers[1] + "+" + characters["e"] + "+" +
        characters[1] + "+" + characters[0] + "+" + characters[0] + ")+[]";

    characters["+"] = "(" + _1e100 + ")[" + numbers[2] + "]";

    functionConstructor = "[][" + hieroglyphyString("sort") + "][" +
        hieroglyphyString("constructor") + "]";

    //Below characters need target http(s) pages
    locationString = "[]+" + hieroglyphyScript("return location");
    characters["h"] = "(" + locationString + ")" + "[" + numbers[0] + "]";
    characters["p"] = "(" + locationString + ")" + "[" + numbers[3] + "]";
    characters["/"] = "(" + locationString + ")" + "[" + numbers[6] + "]";

    unescape = hieroglyphyScript("return unescape");
    escape = hieroglyphyScript("return escape");

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

        if ((char === "\\") || (char == "x")) {
            //These chars must be handled appart becuase the others need them
            characters[char] = getUnescapeSequence(charCode);
            return characters[char];
        }

        shortestSequence = getUnicodeSequence(charCode);

        //ASCII characters can be obtained with hexa and unscape sequences
        if (charCode < 128) {
            unescapeSequence = getUnescapeSequence(charCode);
            if (shortestSequence.length > unescapeSequence.length) {
                shortestSequence = unescapeSequence;
            }

            hexaSequence = getHexaSequence(charCode);
            if (shortestSequence.length > hexaSequence.length) {
                shortestSequence = hexaSequence;
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

    function hieroglyphyNumber (n) {
        n = +n;

        if (n <= 9) {
            return numbers[n];
        }

        return "+(" + hieroglyphyString(n.toString(10)) + ")";
    }

    function hieroglyphyScript (src) {
        return functionConstructor + "("  + hieroglyphyString(src) + ")()";
    }

    API = {
        hieroglyphyString: hieroglyphyString,
        hieroglyphyNumber: hieroglyphyNumber,
        hieroglyphyScript: hieroglyphyScript
    };

    if (global.define && global.define.amd) {
        global.define([], API);
    } else if (typeof exports !== "undefined") {
        module.exports = API;
    } else {
        global.hieroglyphy = API;
    }

})(this);
