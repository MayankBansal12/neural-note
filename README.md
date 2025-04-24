# neuro notes
a note taking web app with AI (coz why not?)


## Key Features

- **User Accounts**:
  - Create a new account using email or using Google
  - Verify email through supabase auth

- **CRUD for notes**:
  - Create a new note, edit or delete it
  - Use AI to create/generate new day as per the prompt

- **Summarize using AI**:
  - Use AI to summarize a note or summarize recent notes (5 notes for now)


## Installation and setup

Perform the following steps after cloning the repo locally:

1. Install dependencies:
   ```bash
   npm install
   
2. Build the project:
   ```bash
   npm run build
   
3. Run the server:
   ```bash
   npm run dev

Make sure to create a `.env.local` file with the following configurations:
   ```bash
  NEXT_PUBLIC_OPENROUTER_API_KEY= __openrouter_api_key__
NEXT_PUBLIC_SUPABASE_URL= ___supabase__url___
NEXT_PUBLIC_SUPABASE_ANON_KEY= __anon_key__
```

note: using [open router](https://openrouter.ai/) for generating AI responses and `microsoft/mai-ds-r1:free` model


## Technologies Used

- Frontend: Next.js, tailwindcss, shadcn
- Backend: Supabase for auth, db
- Other: React query for state management, OpenRouter for AI responses
  
## Demo

Access the loom video demo [here](https://www.loom.com/share/f0b7c79eadf740f4a407c40a21739f95?sid=b778e661-ebce-49b4-b119-98455e07b7f8)
<br/>
Access the website live:- [neuro-notes](https://neural-note-nine.vercel.app/)

## Screenshots
<img width="500px" height="200px" src="https://github.com/user-attachments/assets/c451a7ca-4ea9-4368-bf4f-c94c1d404d4d" />
<img width="500px" height="200px" src="https://github.com/user-attachments/assets/0c4b815c-c25d-450a-8864-0b2540fa5483" />
<img width="500px" height="300px" src="https://github.com/user-attachments/assets/70c898d7-ce4b-45bb-a454-5070680970f6" />

### Wireframes
<img width="500px" src="https://github.com/user-attachments/assets/44a76557-08bc-4c8f-8253-30b688884d77" />
<img width="500px" src="https://github.com/user-attachments/assets/03dcaf81-b841-430d-80cc-94ceefb81c76" />
<img width="500px" src="https://github.com/user-attachments/assets/97bc48d5-96d6-4375-b6b4-5ed152768fea" />
<img width="500px" src="https://github.com/user-attachments/assets/f65fd625-e7e4-4abe-881c-b1e2394c3879" />



## License
This is a personal project, not for commercial use. The design is original, and any resemblance is unintentional and I apologize for the same. In case of queries or feedback, you can reach out at mayankbansal125@gmail.com.

---
