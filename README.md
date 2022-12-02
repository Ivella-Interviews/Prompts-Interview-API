# Prompts API documentation

Base URL: \
https://us-central1-ivella-372e0.cloudfunctions.net/ 

Notes: \
All times are returned in epoch time (in seconds) 
  
# Links:
* [Fetch Prompts and Answers](#fetch-prompts)
* [Post Answer](#post-answer)
* [Like Answer](#like-answer)
* [Unlike Answer](#unlike-answer)


# Fetch Prompts

This endpoint fetches all the prompts and their associated answers\
`GET /prompts`

**Success Code**: \
`200 OK`

**Error Codes** : \
`404 Could not fetch information from database`

**Example Query Response**

```json
{
    "prompts": [
        {
            "promptID": "8jvtduGXNJu8QAylgjfe",
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

This endpoint is used to post an answer to a prompt\
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
    "promptID": "8jvtduGXNJu8QAylgjfe"
}
```

**Query Response**
```json
{
    "answerID": "yBvsqFM0UbTiNysGVVZS",
    "username": "ericjubber",
    "answer": "My ideal first date is getting ice cream and going on walk on the beach!",
    "time": 1669763132,
    "likes": []
}
```



# Like Answer

This endpoint is used to like an answer to a prompt\
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
    "promptID": "8jvtduGXNJu8QAylgjfe"
}
```

**Query Response**
```json
{
    "success": true
}
```




# Unlike Answer

This endpoint is used to unlike an answer to a prompt\
`POST /unlikeAnswer`

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
    "promptID": "8jvtduGXNJu8QAylgjfe"
}
```

**Query Response**
```json
{
    "success": true
}
```



# Post Prompt

This endpoint is used to post a prompt\
`POST /askPrompt`

**Success Code**: \
`200 Success`

**Error Codes**: \
`401 Request body incomplete/invalid`\
`404 Error completing database request occurred`\

**Example Query Body**
```json
{
    "prompt": "What is your ideal first date?",
    "startTime": 1669708800,
    "endTime": 1669795200
}
```

**Query Response**
```json
{
    "promptID": "8jvtduGXNJu8QAylgjfe",
    "startTime": 1669708800,
    "endTime": 1669795200,
    "prompt": "What is your ideal first date?",
    "answers": []
}
```