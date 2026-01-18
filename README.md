This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

sequenceDiagram
    participant U as User
    participant A as Agent API
    participant KB as KB System
    participant O as Ollama
    participant P as Pinecone
    participant F as File Storage
    
    Note over U,F: 🚀 Generation Request Flow
    
    U->>A: POST /api/agent<br/>{prompt: "create todo app"}
    activate A
    
    A->>KB: intelligentKBSearch(prompt)
    activate KB
    
    KB->>O: Generate embedding<br/>model: nomic-embed-text
    activate O
    O-->>KB: vector[768]
    deactivate O
    
    KB->>P: Query vectors<br/>topK: 15
    activate P
    P-->>KB: 15 similar items<br/>(with scores)
    deactivate P
    
    KB->>F: Load full KB items
    activate F
    F-->>KB: All KB items data
    deactivate F
    
    KB->>KB: Re-rank by:<br/>vector score + priority +<br/>success rate + confidence
    
    KB-->>A: Top 7 KB items
    deactivate KB
    
    A->>KB: getKBContext(items)
    activate KB
    KB->>KB: Format context with<br/>examples & mistakes
    KB-->>A: Formatted KB context
    deactivate KB
    
    A->>A: Build system prompt:<br/>BASE + KB_CONTEXT + USER_PROMPT
    
    A->>O: Generate code<br/>with KB guidance
    activate O
    O-->>A: Generated files
    deactivate O
    
    A->>A: Validate files:<br/>use client check,<br/>JSX balance, etc.
    
    alt Validation Success
        A->>KB: logGeneration(success=true)
        activate KB
        KB->>F: Save to logs.json
        activate F
        F-->>KB: Saved
        deactivate F
        
        KB->>F: Update KB stats<br/>(useCount++, successRate)
        activate F
        F-->>KB: Updated
        deactivate F
        deactivate KB
        
        A-->>U: 200 OK<br/>{files, success: true}
    else Validation Failed
        A->>KB: logGeneration(success=false, error)
        activate KB
        KB->>F: Save to logs.json
        activate F
        F-->>KB: Saved
        deactivate F
        deactivate KB
        
        A-->>U: 400 Error<br/>{error message}
    end
    
    deactivate A
    
    Note over U,F: 🤖 Auto-Learning Flow (Every 10th Generation)
    
    A->>KB: learnFromLogs()
    activate KB
    
    KB->>F: Load generation-logs.json
    activate F
    F-->>KB: Last 50 logs
    deactivate F
    
    KB->>KB: Analyze patterns<br/>(successful gens)
    KB->>KB: Analyze errors<br/>(failed gens)
    
    alt New Pattern Found
        KB->>KB: Create new KB item<br/>source: auto-learned
        
        KB->>O: Generate embedding
        activate O
        O-->>KB: vector[768]
        deactivate O
        
        KB->>F: Save to kb.json
        activate F
        F-->>KB: Saved
        deactivate F
        
        KB->>P: Upsert vector
        activate P
        P-->>KB: Indexed
        deactivate P
    end
    
    KB-->>A: Learning complete
    deactivate KB
    
    Note over U,F: 🔧 Weekly Maintenance
    
    U->>KB: npm run kb:prune
    activate KB
    
    KB->>F: Load all KB items
    activate F
    F-->>KB: All items
    deactivate F
    
    KB->>KB: Evaluate each item:<br/>Keep or Archive?
    
    KB->>F: Save kept items<br/>to kb.json
    activate F
    F-->>KB: Saved
    deactivate F
    
    KB->>F: Save archived items<br/>to kb-archive.json
    activate F
    F-->>KB: Saved
    deactivate F
    
    KB->>P: Delete archived vectors
    activate P
    P-->>KB: Deleted
    deactivate P
    
    KB-->>U: Pruning complete<br/>Kept: 45, Archived: 5
    deactivate KB
