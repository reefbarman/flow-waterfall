var assert      = require("chai").assert;
var waterfall   = require("../index");

var fTest = function(a, fResult){
    waterfall([
        function(fCallback){
            fCallback(null, true, a);
        },
        function(a, fCallback){
            switch(a)
            {
                case 1:
                    fCallback(null, true, a);
                    break;
                case 2:
                    fCallback(null, 3, a);
                    break;
                case 3:
                    fCallback(null, false, a);
                    break;
            }
        },
        function(a, fCallback){
            a += 2;
            fCallback(null, true, a);
        },
        function(a, fCallback){
            a *= 3;
            
            switch (a)
            {
                case 6:
                    fCallback(null, 5, a);
                    break;
                case 9:
                    fCallback(null, true, a);
                    break;
            }
        },
        function(a, fCallback){
            a -= 3;
            fCallback(null, true, a);
        },
        function(a, fCallback){
            a += 3;
            fCallback(null, true, a);
        },
        function(a, fCallback){
            a /= 3;
            fCallback(null, true, a);
        }
    ], fResult);
};

describe("#waterfall", function() {
    describe("flow through each task", function(){
        it("return 3", function(done){
            fTest(1, function(cErr, nResult){
                assert.equal(cErr, null, "Error found");
                assert.equal(nResult, 3, "Flow broken");
                done();
            });
        });
    });
    
    describe("skips through tasks", function(){
        it("return 3", function(done){
            fTest(2, function(cErr, nResult){
                assert.equal(cErr, null, "Error found");
                assert.equal(nResult, 3, "Flow broken");
                done();
            });
        });
    });
    
    describe("skips straight to end", function(){
        it("return 3", function(done){
            fTest(3, function(cErr, nResult){
                assert.equal(cErr, null, "Error found");
                assert.equal(nResult, 3, "Flow broken");
                done();
            });
        });
    });
});