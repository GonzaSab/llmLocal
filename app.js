const { postCompletion, postCompletionWithSQL } = require("./chatLLM");
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { executeSQLQuery } = require("./sqlHandler");

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const recordsetToString = (recordset) => {
    if (recordset.length === 0) {
        return "No se encontraron resultados para la consulta.";
    }

    const data = recordset.map(row => {
        return Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ');
    });

    return data.join('\n');
};

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(
        async (ctx, ctxFn) => {
            let messagesSQL = [
                {
                    "role": "system",
                    "content": "Eres una inteligencia artificial que transforma la consulta de un cliente de una casa de venta de neumaticos en una query sql. Para eso puedes usar esta tabla como referencia, donde en medida tendra la dimension de la goma por ejemplo 175/65/15 y en marca es la marca de la goma ejemplo yokohama. Esta es la tabla: CREATE TABLE NeumaticosAutos (neumatico_id INT PRIMARY KEY AUTO_INCREMENT,medida VARCHAR(50),marca VARCHAR(50)); solo quiero que devuelvas la query sin ningun texto adicional ni explicacion"
                },
                { "role": "user", "content": ctx.body }
            ];

            try {
                const answerSQL = await postCompletionWithSQL(messagesSQL);
                console.log("Answer SQL: ", answerSQL);

                if (!answerSQL) {
                    throw new Error("La respuesta SQL está vacía");
                }

                const tyreQuery = await executeSQLQuery(answerSQL);
                const tyreQueryText = recordsetToString(tyreQuery);
                console.log("Tyre Query Text: ", tyreQueryText);

                let messages = [
                    {
                        "role": "system",
                        "content": "Eres un vendedor de neumaticos y tu tarea es recibir un / unos neumaticos en lista junto con su marca. Ser conciso y no explayarse. solo repetir lo que se envia"
                    },
                    { "role": "user", "content": tyreQueryText }
                ];

                const answer = await postCompletion(messages);
                console.log("Answer: ", answer);

                await ctxFn.flowDynamic(answer);
            } catch (error) {
                console.error("Error en el flujo principal:", error);
                await ctxFn.flowDynamic("Hubo un error procesando tu consulta. Por favor, intenta nuevamente.");
            }
        }
    );

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
