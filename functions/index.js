
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const dbTools = require('./models/dbTools');

const db = dbTools.db;


exports.helloWorld = functions.https.onRequest(async (request, response) => {
    console.log("Hello world!");

    response.status(200).send("Hello from Ivella!");
    return;
});


exports.prompts = functions.https.onRequest(async (request, response) => {
    try {
        console.log("Getting all prompts with answers");

        const promptsRes = await db.collection("prompts").get();

        console.log("Successfully fetched prompts with answers, parsing data now...");

        let promptFields = [];
        let answerPromises = [];
        
        promptsRes.docs.forEach((prompt) => {
            let promptData = {
                promptID: prompt.id,
                startTime: prompt.data().startTime._seconds,
                endTime: prompt.data().endTime._seconds,
                prompt: prompt.data().prompt,
                answers: []
            };

            promptFields.push(promptData);
            answerPromises.push(prompt.ref.collection('answers').get());
        });

        const answerFields = await Promise.all(answerPromises);

        for(let i = 0 ; i < answerFields.length ; i++) {
            answerFields[i].docs.forEach((answer) => {
                promptFields[i].answers.push({
                    answerID: answer.id,
                    username: answer.data().username,
                    answer: answer.data().answer,
                    time: answer.data().time._seconds,
                    likes: answer.data().likes
                });
            })
        }

        let ret = {
            prompts: promptFields
        };

        console.log(ret);
        console.log("Finished executing query!");

        response.status(200).send(ret);
        return;

    } catch (err) {
        console.error("Could not fetch prompts and answers:")
        console.error(err);

        response.status(404).send({
            error: err
        });
        return;
    }
});



exports.answer = functions.https.onRequest(async (request, response) => {
    try {
        const username = request.body.username;
        const answer = request.body.answer;
        const promptID = request.body.promptID;

        console.log("Validating response body to insert answer");

        if(username == null || answer == null || promptID == null) {
            const errMessage = "One of more fields are undefined, please check request body: " + JSON.stringify(request.body);
            console.warn(errMessage);

            response.status(401).send({
                error: errMessage
            });
            return;
        }

        console.log("Body is correct, inserting answer for prompt", promptID, "for user", username);

        const time = new Date();

        let insertParams = {
            answer: answer,
            username: username,
            time: time,
            likes: []
        };

        const insertRes = await db.collection('prompts').doc(promptID).collection('answers').add(insertParams);

        console.log("Success insert! fetching inserted item and returning now.");

        const fetchInsertedAnswer = await insertRes.get();

        let ret = {
            answerID: fetchInsertedAnswer.id,
            answer: fetchInsertedAnswer.data().answer,
            username: fetchInsertedAnswer.data().username,
            time: fetchInsertedAnswer.data().time._seconds,
            likes: []
        }

        console.log(ret);
        console.log("Finished!");
        
        response.status(200).send(ret);
        return;

    } catch (err) {
        console.error("Could not add answer:")
        console.error(err);

        response.status(404).send({
            error: err
        });
        return;
    }
});


exports.likeAnswer = functions.https.onRequest(async (request, response) => {
    try {
        const username = request.body.username;
        const promptID = request.body.promptID;
        const answerID = request.body.answerID;

        console.log("Validating response body to like answer");

        if(username == null || promptID == null || answerID == null) {
            const errMessage = "One of more fields are undefined, please check request body: " + JSON.stringify(request.body);
            console.warn(errMessage);

            response.status(401).send({
                error: errMessage
            });
            return;
        }

        console.log("Body is correct, updating answer likes for answer", answerID, "with user", username);


        const updateRes = await db.collection('prompts').doc(promptID).collection('answers').doc(answerID).update({
            likes: admin.firestore.FieldValue.arrayUnion(username)
        });

        console.log(updateRes);
        console.log("Success update! Finished");
        
        response.status(200).send({
            success: true
        });
        return;

    } catch (err) {
        console.error("Could not like answer:")
        console.error(err);

        response.status(404).send({
            error: err
        });
        return;
    }
});


exports.unlikeAnswer = functions.https.onRequest(async (request, response) => {
    try {
        const username = request.body.username;
        const promptID = request.body.promptID;
        const answerID = request.body.answerID;

        console.log("Validating response body to unlike answer");

        if(username == null || promptID == null || answerID == null) {
            const errMessage = "One of more fields are undefined, please check request body: " + JSON.stringify(request.body);
            console.warn(errMessage);

            response.status(401).send({
                error: errMessage
            });
            return;
        }

        console.log("Body is correct, updating answer likes for answer", answerID, "with user", username);


        const updateRes = await db.collection('prompts').doc(promptID).collection('answers').doc(answerID).update({
            likes: admin.firestore.FieldValue.arrayRemove(username)
        });

        console.log(updateRes);
        console.log("Success update! Finished");
        
        response.status(200).send({
            success: true
        });
        return;

    } catch (err) {
        console.error("Could not unlike answer:")
        console.error(err);

        response.status(404).send({
            error: err
        });
        return;
    }
});





exports.createPrompt = functions.https.onRequest(async (request, response) => {
    try {
        const prompt = request.body.prompt;
        const startTime = request.body.startTime;
        const endTime = request.body.endTime;

        console.log("Validating response body to insert prompt");

        if(prompt == null || startTime == null || endTime == null) {
            const errMessage = "One of more fields are undefined, please check request body: " + JSON.stringify(request.body);
            console.warn(errMessage);

            response.status(401).send({
                error: errMessage
            });
            return;
        }

        console.log("Body is correct, inserting prompt:", prompt);

        let startTimestamp = new Date(startTime * 1000);
        let endTimestamp = new Date(endTime * 1000);

        let insertParams = {
            prompt: prompt,
            startTime: startTimestamp,
            endTime: endTimestamp,
        };

        const insertRes = await db.collection('prompts').add(insertParams);

        console.log("Success insert! fetching inserted prompt and returning now.");

        const fetchInsertedPrompt = await insertRes.get();

        let ret = {
            promptID: fetchInsertedPrompt.id,
            prompt: fetchInsertedPrompt.data().prompt,
            startTime: fetchInsertedPrompt.data().startTime._seconds,
            endTime: fetchInsertedPrompt.data().endTime._seconds,
            answers: []
        }

        console.log(ret);
        console.log("Finished!");
        
        response.status(200).send(ret);
        return;

    } catch (err) {
        console.error("Could not add prompt:")
        console.error(err);

        response.status(404).send({
            error: err
        });
        return;
    }
});