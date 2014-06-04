flow-waterfall
==============

A node module to help ease the pain of callback hell by running tasks in series and allowing skipping through the chain of tasks.

If an error happens anywhere in the chain the rest of the tasks are skipped and the completion callback is called.

The callback passed to each task will advance the chain based on two factors.

The first argument passed to the callback is either null or an error object if an error occured. If an error occurs the complete callback is called straight away and the remaining tasks are skipped.

The second argument can either be true, false, an index or a name of a task to run. If true is passed the next task in the chain is run, if false is passed the remaining tasks are skipped and the completion callback is run, if an integer is passed the task with a matching index in the array of tasks (as long as its further down the chain) is run. If a string is passed and the tasks function is named then that task will run

The remaining arguments will be passed on to the next task called.

## Installation

npm install flow-waterfall

## Usage

```javascript
var waterfall = require("flow-waterfall");

waterfall([
  function(fCallback){
    LongAsyncFunction(function(cErr, result1, result2){
      fCallback(cErr, true, result1, result2); //2nd argument specifies we want to continue the chain
    });  
  },
  function(result1, result2, fCallback){
    if (result1)
    {
      fCallback(null, true); //continue chain
    }
    else if (result2)
    {
      fCallback(null, 3, result2); //skip ahead in chain to callback at index 3
    }
    else
    {
      fCallback(new Error("No results returned"));
    }
  },
  function(fCallback){
    AnotherAsyncFunction(fCallback); //continue chain after callback
  },
  function(result, fCallback){
    if (result)
    {
      CoolAsyncFunction(result, function(cErr, retValue1, retValue2){
        if (retValue1 > 5)
        {
            fCallback(null, false, retValue1, retValue2); //Skip rest of the chain and go straight to complete callback
        }
        else if (retValue2 > 5)
        {
            fCallback(null, "myNamedFunction", retValue1, retValue2); //Skip rest of the chain and go straight to complete callback
        }
        else
        {
          fCallback(cErr, true); //continue chain
        }
      });
    }
    else
    {
      throw new Error("missing result"); //Thrown errors caught and returned to complete callback
    }
  },
  function (fCallback){
    AndAnotherAsyncFunction(fCallback); //continue chain after callback
  },
  function myNamedFunction(fCallback, retValue1, retValue2){
    LastAsyncFunction(retValue1, retValue2, fCallback);
  }
], function(err, a, b){
  if (err)
  {
    console.err(err.message);
  }
  else
  {
    console.log(a + b);
  }
});
```

## Test

npm test

## CHANGE LOG

0.2.0:
    * Support for named functions added! So instead of having to pass an index you can now name the tasks and use the task name