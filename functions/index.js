
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

        const questionsRes = await db.collection("questions").get();

        console.log("Successfully fetched prompts with answers, parsing data now...");

        let questionFields = [];
        let answerPromises = [];
        
        questionsRes.docs.forEach((question) => {
            let questionData = {
                questionID: question.id,
                startTime: question.data().startTime._seconds,
                endTime: question.data().endTime._seconds,
                prompt: question.data().prompt,
                answers: []
            };

            questionFields.push(questionData);
            answerPromises.push(question.ref.collection('answers').get());
        });

        const answerFields = await Promise.all(answerPromises);

        for(let i = 0 ; i < answerFields.length ; i++) {
            answerFields[i].docs.forEach((answer) => {
                questionFields[i].answers.push({
                    answerID: answer.id,
                    username: answer.data().username,
                    answer: answer.data().answer,
                    time: answer.data().time._seconds,
                    likes: answer.data().likes
                });
            })
        }

        let ret = {
            questions: questionFields
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
        const questionID = request.body.questionID;

        console.log("Validating requestion body to insert answer");

        if(username == null || answer == null || questionID == null) {
            const errMessage = "One of more fields are undefined, please check request body: " + JSON.stringify(request.body);
            console.warn(errMessage);

            response.status(401).send({
                error: errMessage
            });
            return;
        }

        console.log("Body is correct, inserting answer for question", questionID, "for user", username);

        const time = new Date();

        let insertParams = {
            answer: answer,
            username: username,
            time: time,
            likes: []
        };

        const insertRes = await db.collection('questions').doc(questionID).collection('answers').add(insertParams);

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
        const questionID = request.body.questionID;
        const answerID = request.body.answerID;

        console.log("Validating requestion body to like answer");

        if(username == null || questionID == null || answerID == null) {
            const errMessage = "One of more fields are undefined, please check request body: " + JSON.stringify(request.body);
            console.warn(errMessage);

            response.status(401).send({
                error: errMessage
            });
            return;
        }

        console.log("Body is correct, updating answer likes for answer", answerID, "with user", username);


        const updateRes = await db.collection('questions').doc(questionID).collection('answers').doc(answerID).update({
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