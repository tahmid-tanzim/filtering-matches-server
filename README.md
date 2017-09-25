# Filtering Matches Server

1. Clone this repo from `https://github.com/tahmid-tanzim/filtering-matches-server.git`
2. Run `npm install` from the root directory
3. Run `npm run dev`

Your API will now be served to `localhost:8080` by default.

Sample API Endpoints
```
http://localhost:8080/api/v1/person?age=18&age=95&compatibility_score=1&compatibility_score=99&height=135&height=210 

```

**Note:** I haven't implement any data storage for this coding exercise. Simply export object from `api/models/matches.js`.