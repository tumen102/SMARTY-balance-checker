const config = require("./config.json"); // to fetch auth header & useConvertedUnits setting

(async () => {
    const req = await fetch(
        "https://smarty.co.uk/api/v1/usage",
        {
            "headers": {
                "Authorization": config.authentication
            }
        }
    );
    let data = await req.json();

    if(data.errors) {
        for(const errorIndex in data.errors) {
            const error = data.errors[errorIndex];
            console.error(`[API ERROR ${errorIndex}] ${error.detail} (${error.code})`);
        }
        return;
    }
 
    // they return the valuable data in {data:HERE}
    // so this looks confusing, sorry
    data = data.data;

    const usedObj      = data.attributes.plan.totals.data.used;
    const limitObj     = data.attributes.plan.totals.data.limit;
    const remainingObj = data.attributes.plan.totals.data.remaining;

    let used;
    let limit;
    let remaining;

    if(config.useConvertedUnits) {
        // value_converted is automatically converted to unit_converted
        // by the server. (example is 100 and GB respectively)
        used      = usedObj.value_converted      + usedObj.unit_converted;
        limit     = limitObj.value_converted     + limitObj.unit_converted;
        remaining = remainingObj.value_converted + remainingObj.unit_converted;
    } else {
        // use raw data, also from the server.
        used      = usedObj.value      + usedObj.unit;
        limit     = limitObj.value     + limitObj.unit;
        remaining = remainingObj.value + remainingObj.unit;
    }

    

    console.log(`${remaining} / ${limit} (${used} used)`);
})();