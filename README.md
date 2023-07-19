# GPT CHAT - web app w/ Next.js, Nest.js and MongoDB

## The Challenge ⚡️

https://github.com/tpazyot127/chat-app_fullstack/assets/62755166/1f4c49ec-11fe-45fb-9c6e-47bb8a334057



Here was the challenge:

- Use a freely available or cheap, pre-trained language model for generating responses.
- Include unit test setup and at least a couple of tests for your system.
- User must login and registration
- Save user chat history 
- Implement rate limiting to prevent abuse of the chatbot system.
- Note : If you can't send messages, please install 1.1.1.1 and start, then try again.

## Built With ✨

- [Nest.js](https://nestjs.com/) - node.js framework
- React Bootstrap - UI library
- Redux - State management library
- JWT - tokens for authentication
- [Next.js](https://nextjs.org/) - react.js framework
- MongoDB - Document database
- Typescript

## Running Locally 🖥️

Clone the project

```bash
git clone
```

Go to the project directory

```bash
cd CHAT_APP_GPT
```

Remove remote origin

```bash
git remote remove origin
```

Install dependencies

```bash
yarn install
```

Install dependencies - All

```bash
yarn install-all
```

Install dependencies - Client

```bash
cd client
```

```bash
yarn install
```

Install dependencies - Backend

```bash
cd backend
```

```bash
yarn install
```

Add Environment Variables - Backend

<details>
  <summary>Click to expand!</summary>
  
  - `MONGODB_URL` 
  - `CLIENT_URL` : 'DEV' or 'PROD'
  - `OPENAI_ORGANIZATION`
  - `OPENAI_API_KEY`

</details>

Add Environment Variables - Frontend

<details>
  <summary>Click to expand!</summary>

  - `CLIENT_URL` : 'DEV' or 'PROD'

</details>

Start all at root folder

```bash
yarn start-all
```

Start the server

```bash
cd backend
yarn start:dev
```

Start the client

```bash
cd client
yarn dev
```

Run test
- run test at root folder
```bash
yarn test 

```bash
cd backend
```

```bash
yarn test
```

```bash
cd client
```

```bash
yarn test
```

## Author

- [@edward](https://github.com/tpazyot127)
