# PolicyMe System Architecture

## Overview
PolicyMe is a full-stack application that ingests U.S. Congressional data (bills, summaries, amendments) from Congress.gov, stores it in MongoDB, and exposes AI-powered insights through REST APIs and an MCP (Model Context Protocol) server.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SYSTEMS                             │
├─────────────────────────────────────────────────────────────────────┤
│  Congress.gov API         GPO API          AI Providers (OpenAI/     │
│  (Bills, Summaries,       (Documents)      Anthropic via ChatClient) │
│   Amendments)                                                         │
└────────────┬──────────────────┬──────────────────────┬───────────────┘
             │                  │                      │
             ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SPRING BOOT BACKEND                           │
│                      (Java 21, Spring Boot 3.5.6)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    DATA INGESTION LAYER                       │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ StartupEventListener (@EventListener)                    │ │  │
│  │  │  • Triggered on ApplicationReadyEvent                    │ │  │
│  │  │  • Orchestrates async data fetch                         │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                              │                                 │  │
│  │         ┌────────────────────┼─────────────────────┐          │  │
│  │         ▼                    ▼                     ▼          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │  │
│  │  │ BillService  │  │SummaryService│  │AmendmentService  │   │  │
│  │  │  @Async      │  │   @Async     │  │    @Async        │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │  │
│  │         │                    │                     │          │  │
│  │         │ WebClient          │ WebClient           │ WebClient│  │
│  │         ▼                    ▼                     ▼          │  │
│  │   Congress.gov API     Congress.gov API    Congress.gov API  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                │                                     │
│                                ▼                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    PERSISTENCE LAYER                          │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  MongoDB (localhost:27017/congressDB)                    │ │  │
│  │  │                                                            │ │  │
│  │  │  Collections:                                             │ │  │
│  │  │    • bills        (Bill documents)                        │ │  │
│  │  │    • summaries    (Summary documents)                     │ │  │
│  │  │    • amendments   (Amendment documents)                   │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                              ▲                                 │  │
│  │  ┌───────────────────────────┴──────────────────────────────┐ │  │
│  │  │  Spring Data MongoDB Repositories                         │ │  │
│  │  │    • BillRepository (+ custom queries)                    │ │  │
│  │  │    • SummaryRepository                                    │ │  │
│  │  │    • AmendmentRepository                                  │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      AI SERVICE LAYER                         │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  PolicyAiService                                          │ │  │
│  │  │    • ask(question) → AI Q&A                               │ │  │
│  │  │    • summarizeBill(billId) → Bill summary                 │ │  │
│  │  │    • compareBills(idA, idB) → Comparison                  │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  PolicyImpactService                                      │ │  │
│  │  │    • explainImpact(billId, demographics)                  │ │  │
│  │  │      → Personalized impact analysis                       │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  PolicySearchService                                      │ │  │
│  │  │    • search(query, policyArea) → MongoDB query            │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                              │                                 │  │
│  │                 Uses Optional<ChatClient>                      │  │
│  │                 (OpenAI or Anthropic via Spring AI)            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      REST API LAYER                           │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  /api/bills         BillController                        │ │  │
│  │  │    • GET /count, /all                                     │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  /api/summaries     SummaryController                     │ │  │
│  │  │    • GET /count, /all                                     │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  /api/amendments    AmendmentController                   │ │  │
│  │  │    • GET /count, /all                                     │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  /api/policy        PolicyInsightsController              │ │  │
│  │  │    • POST /search       (title/policy area search)        │ │  │
│  │  │    • GET  /summarize/{id}  (bill summary via AI)          │ │  │
│  │  │    • POST /impact       (demographic impact analysis)     │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  /api/ai            AiController                          │ │  │
│  │  │    • POST /ask                                            │ │  │
│  │  │    • GET  /summarize/bill/{id}                            │ │  │
│  │  │    • POST /compare/bills                                  │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   MCP (Model Context Protocol) LAYER          │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  PolicyMcpTools (@Component)                              │ │  │
│  │  │    Exposes 3 MCP-compatible tools:                        │ │  │
│  │  │      1. searchPolicy(query, policyArea)                   │ │  │
│  │  │         → Search bills in MongoDB                         │ │  │
│  │  │      2. summarizePolicy(billId)                           │ │  │
│  │  │         → AI summary of a bill                            │ │  │
│  │  │      3. explainPolicyImpact(billId, demographics)         │ │  │
│  │  │         → Personalized impact based on user profile       │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                              │                                 │  │
│  │                              │ (Future: MCP Server SSE/stdio)  │  │
│  │                              ▼                                 │  │
│  │  [ Not yet wired to Spring AI MCP Server/Client—scaffolded ]  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Port: 8081                                                           │
└─────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS FRONTEND                              │
│                   (React 19, Next.js 15.5.4, Tailwind CSS 4)         │
├─────────────────────────────────────────────────────────────────────┤
│  Components:                                                          │
│    • Header, Footer                                                   │
│    • SearchBar (calls backend /api/policy/search)                    │
│    • PolicyCard, PolicyDescription                                    │
│    • ContentGrid (LeftContent, RightContent)                          │
│                                                                       │
│  Services:                                                            │
│    • api.ts (base fetch client using NEXT_PUBLIC_API_URL)            │
│    • policyService.ts (search, getPolicy, etc.)                      │
│                                                                       │
│  Port: 3000                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Pipeline

### 1. **Startup Ingestion (Automatic)**

```
Application Start
       │
       ▼
ApplicationReadyEvent
       │
       ▼
StartupEventListener.onApplicationReady()
       │
       ├─── BillService.fetchAllBillDataAsync() ──────┐
       ├─── SummaryService.fetchAllSummaryDataAsync() ─┤
       └─── AmendmentService.fetchAllAmendmentDataAsync() ─┤
              │                                           │
              ▼                                           │
       WebClient → Congress.gov API                       │
              │                                           │
              ▼                                           │
       Parse BillResponse/SummaryResponse/AmendmentResponse
              │                                           │
              ▼                                           │
       BillRepository.saveAll(bills)                      │
       SummaryRepository.saveAll(summaries)               │
       AmendmentRepository.saveAll(amendments)            │
              │                                           │
              ▼                                           │
       MongoDB (congressDB)                               │
              │                                           │
              └──────────────> CompletableFuture.join() ──┘
                                     │
                                     ▼
                          ✅ Data ingestion complete
```

**Key Details:**
- **Async execution**: Each service runs in parallel using `@Async` and `CompletableFuture`.
- **WebClient**: Configured in `WebConfigClient.java` with Congress.gov base URL and larger buffer for large JSON responses.
- **Error handling**: 404s are skipped gracefully; other exceptions are logged.
- **Pagination**: Each service fetches data in batches (250 items/request, offset increments).
- **Congress sessions**: Hardcoded to 117 and 118; bill types: `hr`, `s`, `hjres`, `sjres`, `hres`, `sres`.

---

### 2. **User Query Flow (REST API)**

```
Frontend (Next.js)
       │
       │ HTTP POST /api/policy/search
       │ Body: { query: "healthcare", policyArea: "Health" }
       │
       ▼
Backend: PolicyInsightsController.search()
       │
       ▼
PolicySearchService.search(query, policyArea)
       │
       ├─── BillRepository.findTop20ByTitleContainingIgnoreCase(query)
       └─── BillRepository.findTop20ByPolicyArea_NameIgnoreCase(policyArea)
       │
       ▼
MongoDB query execution
       │
       ▼
Returns List<Bill>
       │
       ▼
JSON response → Frontend
       │
       ▼
Display results in UI
```

**Key Details:**
- **Custom queries**: Spring Data MongoDB derived query methods for case-insensitive search.
- **Deduplication**: Simple stream-based dedup by `Bill.id`.
- **CORS**: Enabled for `localhost:3000` via `WebConfig.java`.

---

### 3. **AI-Powered Insights Flow**

```
User requests AI summary or impact analysis
       │
       ▼
Frontend → POST /api/policy/impact
           Body: { billId: "...", demographics: { age, state, ... } }
       │
       ▼
Backend: PolicyInsightsController.impact()
       │
       ▼
PolicyImpactService.explainImpact(billId, demographics)
       │
       ├─── BillRepository.findById(billId)
       │    │
       │    ▼
       │ MongoDB query
       │    │
       │    ▼
       │ Build bill context + demographics context
       │
       └─── Optional<ChatClient>.map(cc -> cc.prompt().user(...).call().content())
              │
              ▼
       AI Provider (OpenAI or Anthropic via Spring AI)
              │
              ▼
       AI-generated impact explanation
              │
              ▼
       Return as JSON string
              │
              ▼
Frontend displays personalized impact
```

**Key Details:**
- **Optional AI**: If `ChatClient` bean is not present (no API keys configured), endpoints return: `"AI not configured. Set your model API keys to enable this endpoint."`
- **Spring AI 1.1.x**: Uses core modules (`spring-ai-client-chat`, `spring-ai-openai`, `spring-ai-anthropic`) since Boot starters aren't available.
- **Prompt engineering**: Context includes bill title, number, type, congress, policy area, latest action, sponsors + user demographics.

---

## 🔌 MCP (Model Context Protocol) Pipeline

### Current State: **Scaffolded (Not Yet Wired)**

The MCP layer is prepared but not yet connected to a Spring AI MCP Server/Client. Here's what exists and what's needed:

### **What's Built:**

```
PolicyMcpTools (@Component)
       │
       ├─── searchPolicy(query, policyArea)
       │         → Delegates to PolicySearchService
       │         → Returns List<Bill>
       │
       ├─── summarizePolicy(billId)
       │         → Delegates to PolicyAiService.summarizeBill()
       │         → Returns String (AI summary or error message)
       │
       └─── explainPolicyImpact(billId, demographics)
                 → Delegates to PolicyImpactService.explainImpact()
                 → Returns String (personalized impact or error)
```

**Purpose:**
- Centralize the three core policy operations that external AI models (Claude Desktop, OpenAI assistants, etc.) can call via MCP.
- Acts as the "tool registry" for MCP server configuration.

### **What's Needed to Complete MCP Integration:**

#### **Option A: MCP Server (Expose tools to AI models)**

```
┌──────────────────────────────────────────────────────────────────┐
│                     MCP SERVER SETUP                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Create MCPServerConfig.java                                 │
│     ├─── Instantiate Spring AI MCP Server (SSE or stdio)        │
│     ├─── Register PolicyMcpTools methods as MCP tools           │
│     └─── Expose SSE endpoint (e.g., /mcp/sse) or stdio          │
│                                                                  │
│  2. Configure application.properties                            │
│     ├─── spring.ai.mcp.server.protocol=sse                      │
│     ├─── spring.ai.mcp.server.port=8082 (or same as app)        │
│     └─── spring.ai.mcp.server.name=policy-mcp-server            │
│                                                                  │
│  3. Client Connection (Claude Desktop / Anthropic MCP SDK)      │
│     ├─── Add MCP server config to Claude Desktop settings       │
│     └─── Point to http://localhost:8082/mcp/sse                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Flow:**
```
Claude Desktop (or other MCP client)
       │
       │ MCP handshake over SSE
       ▼
Spring AI MCP Server (running in PolicyMe backend)
       │
       │ Discovers registered tools:
       │   • searchPolicy
       │   • summarizePolicy
       │   • explainPolicyImpact
       │
       ▼
User asks Claude: "Find all healthcare bills affecting small business owners"
       │
       ▼
Claude calls MCP tool: searchPolicy(query="healthcare", policyArea="Health")
       │
       ▼
PolicyMcpTools.searchPolicy() → PolicySearchService → MongoDB
       │
       ▼
Returns List<Bill> → Claude formats response
       │
       ▼
User sees: "Here are 15 healthcare bills..."
       │
       ▼
User: "Summarize the first one"
       │
       ▼
Claude calls: summarizePolicy(billId="xyz")
       │
       ▼
PolicyMcpTools.summarizePolicy() → PolicyAiService → OpenAI/Anthropic
       │
       ▼
AI-generated summary returned to Claude → User
```

#### **Option B: MCP Client (Consume external MCP servers)**

```
┌──────────────────────────────────────────────────────────────────┐
│                     MCP CLIENT SETUP                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Create MCPClientConfig.java                                 │
│     ├─── Instantiate Spring AI MCP Client                       │
│     └─── Connect to external MCP server (e.g., Brave Search)    │
│                                                                  │
│  2. Configure application.properties                            │
│     ├─── spring.ai.mcp.client.connections[0].url=...            │
│     └─── spring.ai.mcp.client.connections[0].protocol=sse       │
│                                                                  │
│  3. Extend PolicyAiService or create new service                │
│     └─── Call external tools via MCP client SDK                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Use Case:**
- Your backend could call external MCP servers (e.g., Brave Search MCP) to enrich policy data with real-time web search results.

---

## 🏢 Project Structure (File Tree)

```
PolicyMe/
├── back-end/
│   └── Policyme/
│       ├── pom.xml                      # Maven dependencies
│       ├── src/main/
│       │   ├── java/com/policyme/Policyme/
│       │   │   ├── PolicymeApplication.java
│       │   │   ├── config/
│       │   │   │   ├── WebConfig.java          # CORS config
│       │   │   │   ├── WebConfigClient.java    # Congress.gov WebClient
│       │   │   │   └── SpringAiConfig.java     # (Future) ChatClient bean
│       │   │   ├── controller/
│       │   │   │   ├── BillController.java
│       │   │   │   ├── SummaryController.java
│       │   │   │   ├── AmendmentController.java
│       │   │   │   ├── PolicyInsightsController.java  # /api/policy
│       │   │   │   └── AiController.java              # /api/ai
│       │   │   ├── dto/
│       │   │   │   ├── Demographics.java
│       │   │   │   ├── SearchPolicyRequest.java
│       │   │   │   ├── ImpactRequest.java
│       │   │   │   ├── AskRequest.java
│       │   │   │   └── CompareRequest.java
│       │   │   ├── mcp/
│       │   │   │   └── PolicyMcpTools.java     # MCP tool scaffolding
│       │   │   ├── model/
│       │   │   │   ├── BillModel/
│       │   │   │   │   ├── Bill.java           # @Document
│       │   │   │   │   ├── BillResponse.java
│       │   │   │   │   ├── LatestAction.java
│       │   │   │   │   ├── PolicyArea.java
│       │   │   │   │   └── Sponsor.java
│       │   │   │   ├── SummariesModel/
│       │   │   │   └── AmendmentModel/
│       │   │   ├── repository/
│       │   │   │   ├── BillRepository.java     # MongoRepository<Bill, String>
│       │   │   │   ├── SummaryRepository.java
│       │   │   │   └── AmendmentRepository.java
│       │   │   ├── service/
│       │   │   │   ├── BillService.java        # Congress.gov ingestion
│       │   │   │   ├── SummaryService.java
│       │   │   │   ├── AmendmentService.java
│       │   │   │   ├── PolicySearchService.java    # MongoDB search
│       │   │   │   ├── PolicyAiService.java        # AI Q&A, summarize, compare
│       │   │   │   └── PolicyImpactService.java    # Demographic impact
│       │   │   └── startup/
│       │   │       └── StartupEventListener.java   # @EventListener
│       │   └── resources/
│       │       └── application.properties      # Spring config, MongoDB, API keys
│       └── target/
│           └── Policyme-0.0.1-SNAPSHOT.jar
│
├── front-end/
│   └── policy-me-frontend/
│       ├── package.json
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx                    # Home page
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── Header.tsx
│       │   │   │   ├── Footer.tsx
│       │   │   │   ├── MainContent.tsx
│       │   │   │   ├── SearchContainer.tsx
│       │   │   │   └── ContentGrid.tsx
│       │   │   ├── ui/
│       │   │   │   ├── SearchBar.tsx           # Calls backend
│       │   │   │   ├── Button.tsx
│       │   │   │   └── ...
│       │   │   ├── policy/
│       │   │   │   ├── PolicyCard.tsx
│       │   │   │   └── PolicyDescription.tsx
│       │   │   └── content/
│       │   │       ├── LeftContent.tsx
│       │   │       └── RightContent.tsx
│       │   ├── services/
│       │   │   ├── api.ts                      # Base fetch client
│       │   │   └── policyService.ts            # Policy API calls
│       │   └── types/
│       │       └── index.ts                    # TypeScript types
│       └── .env.local.example
│
├── ARCHITECTURE.md                             # This file
└── README.md
```

---

## 🔑 Key Technologies

### Backend
- **Spring Boot 3.5.6** (Java 21)
- **Spring Data MongoDB** (NoSQL persistence)
- **Spring WebFlux** (WebClient for Congress.gov API)
- **Spring AI 1.1.0** (OpenAI, Anthropic, MCP support)
- **Lombok** (Reduce boilerplate)
- **spring-dotenv** (Environment variable management)

### Frontend
- **Next.js 15.5.4** (React 19 framework)
- **Tailwind CSS 4** (Utility-first styling)
- **Radix UI** (Accessible components)
- **lucide-react** (Icons)

### Database
- **MongoDB 7.x** (Document store for bills, summaries, amendments)

### AI Integration
- **Spring AI ChatClient** (Unified interface for LLMs)
- **OpenAI** (GPT models)
- **Anthropic** (Claude models)
- **MCP (Model Context Protocol)** (Tool calling standard for AI agents)

---

## 🚀 Deployment Considerations

### Current Setup (Local Development)
- **Backend**: `./mvnw spring-boot:run` or `java -jar target/Policyme-0.0.1-SNAPSHOT.jar`
- **Frontend**: `npm run dev` (Next.js dev server on port 3000)
- **MongoDB**: Local instance on `mongodb://localhost:27017`

### Production Readiness Checklist
- [ ] Move API keys to secure vault (e.g., AWS Secrets Manager, Azure Key Vault)
- [ ] Configure MongoDB Atlas or hosted MongoDB
- [ ] Add authentication/authorization (Spring Security + JWT)
- [ ] Rate limiting on Congress.gov API calls
- [ ] Caching layer (Redis) for frequently accessed bills
- [ ] Containerize with Docker (Docker Compose for multi-service setup)
- [ ] CI/CD pipeline (GitHub Actions, Jenkins)
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Logging (ELK stack or Datadog)
- [ ] MCP server production config (HTTPS, authentication)

---

## 🎯 MCP Integration Roadmap

### Phase 1: Local MCP Server ✅ (Scaffolded)
- [x] Add spring-ai-mcp dependency
- [x] Create PolicyMcpTools with 3 methods
- [x] Wire to existing services
- [ ] **Next: Create MCPServerConfig.java**
- [ ] **Next: Expose SSE endpoint**
- [ ] **Next: Test with Claude Desktop**

### Phase 2: Tool Enhancements
- [ ] Add more MCP tools:
  - [ ] `listRecentBills()` - Latest bills by date
  - [ ] `getBillSponsors(billId)` - Sponsor details
  - [ ] `trackBillProgress(billId)` - Latest action timeline
  - [ ] `findSimilarBills(billId)` - Semantic search
- [ ] Add streaming support for long summaries
- [ ] Add caching for frequently requested summaries

### Phase 3: MCP Client (Consume External Tools)
- [ ] Connect to Brave Search MCP
- [ ] Connect to Wikipedia MCP
- [ ] Enrich policy data with real-time search results

### Phase 4: Production Deployment
- [ ] Secure MCP server with authentication
- [ ] Deploy MCP server to cloud (AWS/Azure/GCP)
- [ ] Monitor MCP tool usage metrics
- [ ] Add MCP tool versioning

---

## 📞 API Reference

### REST Endpoints

#### Bills
- `GET /api/bills/count` - Total bill count
- `GET /api/bills/all` - List all bills (paginated)

#### Summaries
- `GET /api/summaries/count` - Total summary count
- `GET /api/summaries/all` - List all summaries

#### Amendments
- `GET /api/amendments/count` - Total amendment count
- `GET /api/amendments/all` - List all amendments

#### Policy Insights
- `POST /api/policy/search` - Search bills by title/policy area
  ```json
  { "query": "healthcare", "policyArea": "Health" }
  ```
- `GET /api/policy/summarize/{billId}` - AI summary of a bill
- `POST /api/policy/impact` - Personalized impact analysis
  ```json
  {
    "billId": "xyz",
    "demographics": {
      "age": 34,
      "state": "CA",
      "incomeBracket": "middle",
      "veteran": false,
      "student": false,
      "smallBusinessOwner": true
    }
  }
  ```

#### AI Endpoints
- `POST /api/ai/ask` - General Q&A
  ```json
  { "question": "What is the Inflation Reduction Act?" }
  ```
- `GET /api/ai/summarize/bill/{id}` - Bill summary
- `POST /api/ai/compare/bills` - Compare two bills
  ```json
  { "billIdA": "abc", "billIdB": "def" }
  ```

### MCP Tools (Scaffolded)

#### `searchPolicy`
```typescript
searchPolicy(query: string, policyArea?: string): Promise<Bill[]>
```
Searches MongoDB for bills matching title or policy area.

#### `summarizePolicy`
```typescript
summarizePolicy(billId: string): Promise<string>
```
Generates AI-powered summary of a bill.

#### `explainPolicyImpact`
```typescript
explainPolicyImpact(billId: string, demographics: Demographics): Promise<string>
```
Explains how a bill impacts an individual based on their demographic profile.

---

## 🔒 Security Notes

- **API Keys**: Currently in `application.properties`. Move to environment variables or secrets manager.
- **CORS**: Permissive for development (`localhost:3000`). Restrict in production.
- **MongoDB**: No authentication enabled. Add username/password for production.
- **Rate Limiting**: Not implemented. Add throttling for Congress.gov API.
- **Input Validation**: Basic checks exist. Add comprehensive validation with `@Valid`.

---

## 📚 Additional Resources

- [Spring AI Documentation](https://docs.spring.io/spring-ai/reference/)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Congress.gov API Documentation](https://api.congress.gov/)
- [MongoDB Spring Data Reference](https://docs.spring.io/spring-data/mongodb/reference/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Last Updated**: November 13, 2025
