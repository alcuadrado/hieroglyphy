var hieroglyphy = require("../hieroglyphy"),
    assert = require('assert');

global.location = "http://example.com";
global.testString = "foo";

exports.testHieroglyphyCharacters = function () {
    "use strict";

    var i,
        c,
        encoded,
        evaled;

    for (i = 0; i < 127; i += 1) {
        c = String.fromCharCode(i);
        encoded = hieroglyphy.hieroglyphyString(c);
        evaled = eval(encoded);

        assert.equal(c, evaled);
        assert.type(evaled, 'string');
    }
};

exports.testHieroglyphyNumbers = function () {
    "use strict";

    var i,
        encoded,
        evaled;

    for (i = 0; i < 1000; i += 1) {
        encoded = hieroglyphy.hieroglyphyNumber(i);
        evaled = eval(encoded);

        assert.equal(i, evaled);
        assert.type(evaled, 'number');
    }
};


exports.testHieroglyphyScript = function () {
    "use strict";

    var encoded,
        script;

    //a script doing something (with some unicode)
    script = "global.testString = \"bαr\"";

    assert.equal(global.testString, "foo");
    eval(hieroglyphy.hieroglyphyScript(script));
    assert.equal(global.testString, "bαr");
};
