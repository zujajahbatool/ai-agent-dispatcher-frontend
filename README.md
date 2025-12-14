The AI Agent Dispatcher: Autonomous Orchestration Platform
🏆 Hackathon Submission: AI Agents Assemble | Autonomous Orchestration Challenge
One-Liner Hook:
A live, end-to-end platform using Kestra to orchestrate Oumi-powered AI Agents, monitored by a real-time dashboard and deployed instantly with Vercel.
Live Demo: https://ai-agent-dispatcher-frontend.vercel.app/

💡 The Problem & The Solution
The Challenge:
We aimed to solve the "last mile" problem of AI: ensuring that trained machine learning models (Agents) are automatically executed and their results are immediately visible and actionable. Traditional pipelines are rigid, making it difficult to trigger specific agents based on real-time events, and offering limited observability.
Our Solution: The Agent Dispatcher
We built a dynamic, event-driven solution where:
1.Kestra acts as the central brain, defining complex orchestration logic in declarative code (YAML).
2.The Kestra flow is triggered by a simulated event, which then dispatches the task to the Oumi AI Agent.
3.The Next.js Dashboard provides a unified, real-time view of the entire system's operational status and AI metrics.
Key Achievement: We successfully integrated all three core components (Oumi, Kestra, Dashboard) and demonstrated the correct output flow and validated the architecture. This validates the entire architecture and data pipeline, making it ready for live API integration.

🏗️ Architecture and Technical Implementation:
Our project is a powerful demonstration of a modern, multi-tool AI/MLOps stack.
1. The Core Data Flow:
Component	Role	Technology Used
Orchestration	Event-driven pipeline and agent dispatch.	Kestra (Declarative YAML Flows)
Intelligence	Executes the core AI/ML model and returns results.	Oumi (AI Agent/Library Service)
Frontend	Real-time monitoring and visualization.	Next.js Dashboard on Vercel
Automation	Scaffolding and developer tooling.	Cline CLI

2. Deep Dive: Tool Integrations (Tracks & Awards)
Tool	Contribution & Impact	Aligns with Hackathon Award
Kestra	Used as the central orchestrator (agent_dispatch flow). Implemented Kestra's HTTP Plugin to call the Oumi Agent Service and defined outputs for dashboard consumption.	Wakanda Data Award
Oumi	The AI Agent layer. We architected the Oumi Agent Service, successfully validating the data ingestion and transformation pipeline works end-to-end.	Iron Intelligence Award
Cline	Leveraged the Cline CLI for rapid scaffolding, dependency management, and automation of repetitive tasks, significantly accelerating the hackathon timeline.	Infinity Build Award
Vercel	Instant Global Deployment. Hosted the Next.js frontend, providing a high-performance, publicly accessible link with continuous deployment. https://ai-agent-dispatcher-frontend.vercel.app/	Stormbreaker Deployment Award
CodeRabbit	Used for AI-Powered Code Review on all pull requests, ensuring high code quality, suggesting refactoring, and improving overall project robustness under pressure.	(General Code Quality)
AI	Used as a developer assistant (e.g., Gemini/Copilot) for debugging complex integration errors, generating boilerplate, and enhancing documentation.	(General AI Use)

✨ Key Features & Demo:
Live & Interactive Dashboard: Instantly view the operational status and key metrics of your AI Agent Dispatcher via the deployed frontend.
Unified Observability: The dashboard unifies Kestra's execution status and Oumi's output metrics into one cohesive view.
Decoupled Architecture: The separation of Kestra (control) and Oumi (compute) ensures the system can be scaled independently under heavy load.
Robust Development Cycle: The integration of Cline for automation and CodeRabbit for quality assurance demonstrates a production-ready DevOps approach.
Validated Data Flow: Successful implementation proves the complex frontend-to-backend data structures and integration logic.
🚀 Setup and Installation:
Prerequisites
Docker & Docker Compose
Node.js (v18+) and npm/yarn
1. Backend Setup (Kestra & Oumi Agent Services):
1.Clone Repositories: Clone the necessary flow and service repositories.
2.Start Services: The Kestra and Oumi services run via Docker Compose to provide the necessary API endpoints.
Bash:
docker-compose up -d
2. Dashboard Frontend (Local Development):
1.Install Dependencies:
Bash:
npm install
2.Configure Environment: Ensure the .env.local file contains the correct service URLs:
Plaintext
NEXT_PUBLIC_KESTRA_API_URL=http://localhost:8080
NEXT_PUBLIC_OUMI_API_URL=[Your Oumi Agent Service URL]
3.Run Dashboard Locally:
Bash:
npm run dev
🌐 Deployment:
The dashboard is live and publicly accessible via Vercel:
Live Demo URL: https://ai-agent-dispatcher-frontend.vercel.app/
👥 Team & Contribution:
This project was a highly successful collaborative effort defined by clear specialization across the three core layers.
Name	Role	Contribution Focus
[Team Member 1: AZKA ASHFAQ]	Frontend Architect	Dashboard Development (Next.js), Vercel Deployment, UI/UX, and configuring the frontend data fetching logic.
[Team Member 2: ZUJAJAH BATOOL]	Orchestration Specialist	Kestra Flow Design, setup, and defining the precise API inputs/outputs needed for the other two components.
[Team Member 3: AMMARA HASHIM]	AI Agent Developer	Oumi Agent Service Architecture, defining the agent logic structure, and managing the core data payload/metrics.

Thank you for your time. We are confident in the robustness and potential of our fully integrated AI Agent Dispatcher.

