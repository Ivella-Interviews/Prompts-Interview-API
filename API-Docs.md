# Prompts API documentation

Base URL: \
https://us-central1-ivella-372e0.cloudfunctions.net/
  
# Links:
* [Fetch Prompts and Answers](#fetch-prompts)
* [Post Answer](#post-answer)
* [Like Answer](#like-answer)


# Fetch Prompts

This endpoint fetches all the questions and their associated answers\
`GET /prompts`

**Success Code**: \
`200 OK`

**Error Codes** : \
`404 Could not fetch information from database`

**Query Response**
Note:\
This is just an example of the response this route would return.\
Times are returned in epoch time (in seconds)

```json
{
    "questions":
    [
        {
            "questionID": "8jvtduGXNJu8QAylgjfe",
            "startTime": 1669708800,
            "endTime": 1669795200,
            "prompt": "What is your ideal first date?",
            "answers": [
                {
                    "answerID": "tEFuGFQfPwBYRejXznlf",
                    "username": "ewang101",
                    "answer": "I'm a simple person, getting coffee or dinner are my go-tos :)",
                    "time": 1669854948,
                    "likes": []
                },
                {
                    "answerID": "yBvsqFM0UbTiNysGVVZS",
                    "username":"vishaldubey",
                    "answer": "Personally, I love doing activites such as mini-golf or bowling for first dates",
                    "time": 1669763132,
                    "likes": [
                        "ewang101",
                        "ejubber"
                    ]
                }
            ]
        }
    ]
}
```




# Post Answer

This endpoint is used to post an answer to a question\
`POST /answer`

**Success Code**: \
`200 Success`

**Error Codes**: \
`401 Request body incomplete/invalid`\
`404 Error completing database request occurred`\

**Example Query Body**
```json
{
    "username": "ericjubber",
    "answer": "My ideal first date is getting ice cream and going on walk on the beach!",
    "questionID": "8jvtduGXNJu8QAylgjfe
}
```

**Query Response**
```json
{
    "answerID": "yBvsqFM0UbTiNysGVVZS",
    "username": "ericjubber",
    "answer": "My ideal first date is getting ice cream and going on walk on the beach!",
    "questionID": "8jvtduGXNJu8QAylgjfe",
    "time": 1669763132,
    "likes": []
}
```



# Like Answer

This endpoint is used to like an answer to a question\
`POST /likeAnswer`

**Success Code**: \
`200 Success`

**Error Codes**: \
`401 Request body incomplete/invalid`\
`404 Error completing database request occurred`\

**Example Query Body**
```json
{
    "username": "ericjubber",
    "answerID": "yBvsqFM0UbTiNysGVVZS",
    "questionID": "8jvtduGXNJu8QAylgjfe
}
```

**Query Response**
```json
{
    "success": true
}
```

