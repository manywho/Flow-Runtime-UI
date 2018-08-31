import { executeMacro } from '../js/services/macros/MacroExecution';

const ctx: Worker = self as any;

ctx.onmessage = (e) => {
    const parsedResponse = JSON.parse(e.data);
    const macroResult = executeMacro(
        'function(state){ ' + parsedResponse.macro + '}',
        parsedResponse.metadata,
        parsedResponse.state,
    );
    ctx.postMessage(macroResult);
};
