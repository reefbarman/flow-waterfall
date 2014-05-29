/** @module WaterFall */

/**
 * A function to help control asynchronous called flow based on the waterfall concept
 * This implmentation allows additional control by being able to branch code
 * 
 * @param {function[]} aTasks - a list of tasks to run in order of execution
 * @param {WaterFall~completeCallback} fComplete - the callback to run on completion of the waterfall
 * @param {object} cScope - an object to use as the this variable in each task
 */
function WaterFall(aTasks, fComplete, cScope)
{
    cScope = cScope ? cScope : this;
    
    var fGetResults = function(aArguments, fOnNextTask){
        var aArgs = [];
                        
        for (var i = 2; i < aArguments.length; i++)
        {
            aArgs.push(aArguments[i]);
        }
        
        aArgs.push(fOnNextTask);
        
        return aArgs;
    };
    
    var fGetFinalResults = function(aArguments){
        var aArgs = [null];
                        
        for (var i = 2; i < aArguments.length; i++)
        {
            aArgs.push(aArguments[i]);
        }
        
        return aArgs;
    };
    
    var nCurrentTask = -1;
    
    if (aTasks && aTasks.length > 0)
    {
        var fOnNextTask = function(cErr, advance){
            //On an error the waterfall is immedietaly completed and the error is passed on
            if (cErr)
            {
                fComplete.call(cScope, cErr);
            }
            else
            {
                // If the advance variable is a boolean we are either advancing to the next task or skip remaining tasks
                // otherwise we are providing the index of the next task to run
                if (typeof advance == "boolean")
                {
                    if (advance)
                    {
                        nCurrentTask++;
                        
                        if (nCurrentTask < aTasks.length)
                        {
                            try
                            {
                                aTasks[nCurrentTask].apply(cScope, fGetResults(arguments, fOnNextTask));
                            }
                            catch (cErr)
                            {
                                fComplete.call(cScope, cErr);
                            }
                        }
                        else
                        {
                            fComplete.apply(cScope, fGetFinalResults(arguments));
                        }
                    }
                    else
                    {
                        fComplete.apply(cScope, fGetFinalResults(arguments));
                    }
                }
                else if (typeof advance == "number")
                {
                    if (advance <= nCurrentTask)
                    {
                        fComplete.call(cScope, new RangeError("Can't advance to already run tasks"));
                    }
                    else if (advance >= aTasks.length)
                    {
                        fComplete.call(cScope, new RangeError("Can't advance to an index greater then number of tasks available"));
                    }
                    else
                    {
                        nCurrentTask = advance;
                        
                        try
                        {
                            aTasks[nCurrentTask].apply(cScope, fGetResults(arguments, fOnNextTask));
                        }
                        catch (cErr)
                        {
                            fComplete.call(cScope, cErr);
                        }
                    }
                }
                else
                {
                    fComplete.call(cScope, new TypeError("Advance variable is not of type number or boolean"));
                }
            }
        };
        
        fOnNextTask(null, true);
    }
    else
    {
        fComplete.call(cScope, new Error("No Tasks Available"));
    }
}

module.exports = WaterFall;

/**
 * This callback is displayed as part of the Requester class.
 * @callback WaterFall~completeCallback
 * @param {(Error|null)} cError - An error object on an error in the chain or null if successful
 * @param {...*} results - Any result params passed from the last task in the chain
 */