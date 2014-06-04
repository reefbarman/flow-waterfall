var assert      = require("chai").assert;
var waterfall   = require("../index");

var fTest = function(a, fResult){
    waterfall([
        function task1(fCallback){
            fCallback(null, true, a);
        },
        function task2(a, fCallback){
            switch(a)
            {
                case 1:
                    fCallback(null, true, a);
                    break;
                case 2:
                    fCallback(null, "task4", a);
                    break;
                case 3:
                    fCallback(null, false, a);
                    break;
            }
        },
        function task3(a, fCallback){
            a += 2;
            fCallback(null, true, a);
        },
        function task4(a, fCallback){
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
        function task5(a, fCallback){
            a -= 3;
            fCallback(null, true, a);
        },
        function task6(a, fCallback){
            a += 3;
            fCallback(null, true, a);
        },
        function task7(a, fCallback){
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