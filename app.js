const { postCompletion } = require("./chatLLM")
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(
        async (ctx, ctxFn) => {
            let messages = [
                { "role": "system", "content": "Sos un modelo de lenguaje que esta corriendo de manera local, respondes mensajes de whatsapp de manera amistosa y corta. Das respuestas simples y en español." },
                { "role": "user", "content": ctx.body }
            ]
            const answer = await postCompletion(messages);
            //console.log("Answer: ", answer);
            await ctxFn.flowDynamic(answer);
        })

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
