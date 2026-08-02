# AI Financial Dashboard

AI Financial Dashboard is a full-stack personal finance product built around one practical idea: treat bank statements as documents, not as bank-specific formats.

The [frontend](./frontend/) handles authentication, uploads, persistence through [Prisma](https://www.prisma.io/), analytics endpoints, and the dashboard UI. The [backend](./backend/) handles OCR and LLM-based transaction extraction. Together they turn uploaded statements into structured financial data and then use that data to power charts, summaries, and review flows.

This repo is useful if you want to build a finance dashboard without maintaining a parser for every bank. The system normalizes raw statement text into a shared transaction model first, then builds analytics on top of that model.

## Overview

The product flow is straightforward:

1. A user uploads a statement from the dashboard in [frontend/src/app/(dashboard)/upload](./frontend/src/app/%28dashboard%29/upload/).
2. The upload route in [frontend/src/app/api/upload](./frontend/src/app/api/upload/) validates the request and forwards the file to the Python service.
3. The backend route in [backend/api/routes/upload.py](./backend/api/routes/upload.py) sends the file into OCR through [backend/services/ocr](./backend/services/ocr/).
4. The LLM layer in [backend/services/llm](./backend/services/llm/) extracts transactions from raw OCR text and returns structured JSON.
5. The frontend persists statements, accounts, categories, and transactions through the schema in [frontend/prisma/schema.prisma](./frontend/prisma/schema.prisma).
6. Analytics routes in [frontend/src/app/api/analytics](./frontend/src/app/api/analytics/) expose read models for the dashboard components in [frontend/src/app/components](./frontend/src/app/components/).

The current code already implements the main upload -> OCR -> LLM -> persistence -> dashboard loop. Some of the supporting services for validation, normalization, and worker-based processing are still scaffolds, but the system boundary is already clear.

## Core Capabilities

- Upload bank statements from the dashboard through [frontend/src/app/(dashboard)/upload](./frontend/src/app/%28dashboard%29/upload/).
- Validate authenticated uploads in [frontend/src/app/api/upload/route.js](./frontend/src/app/api/upload/route.js).
- Extract raw text from documents with [Mistral OCR](https://docs.mistral.ai/capabilities/document_ai/ocr/) in [backend/services/ocr/extractor.py](./backend/services/ocr/extractor.py).
- Convert OCR output into structured transaction JSON in [backend/services/llm/extractor.py](./backend/services/llm/extractor.py).
- Persist bank accounts, statements, categories, transactions, recurring transaction data, and budget goals through [Prisma](https://www.prisma.io/) in [frontend/prisma/schema.prisma](./frontend/prisma/schema.prisma).
- Deduplicate transactions using Node's [`crypto.createHash`](https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options) in [frontend/src/app/api/upload/route.js](./frontend/src/app/api/upload/route.js).
- Serve analytics for savings rate, spending by category, anomalies, top merchants, and trend views from [frontend/src/app/api/analytics](./frontend/src/app/api/analytics/).
- Render a chart-driven dashboard with [Recharts](https://recharts.org/) in [frontend/src/app/components](./frontend/src/app/components/).
- Support a product model that can grow from single-user reporting to household finance through the schema in [frontend/prisma](./frontend/prisma/).

## Architecture Flow

```mermaid
flowchart TD
    A[User Uploads PDF or Image] --> B[File Validation]
    B --> C[OCR Extraction]
    C --> D[Raw OCR Text Storage]
    D --> E[LLM Transaction Extraction]
    E --> F[JSON Validation Layer]
    F --> G[Merchant Normalization Engine]
    G --> H[Transaction Categorizer]
    H --> I[Duplicate Detection]
    I --> J[PostgreSQL Database]
    J --> K[Analytics and AI Recommendation]
    K --> L[React Dashboard]
```

### Current Implementation Notes

- `File Validation` is partly implemented in [frontend/src/app/api/upload/route.js](./frontend/src/app/api/upload/route.js) with auth, file presence, extension, and size checks.
- `OCR Extraction` is implemented through [Mistral OCR](https://docs.mistral.ai/capabilities/document_ai/ocr/) in [backend/services/ocr/extractor.py](./backend/services/ocr/extractor.py).
- `LLM Transaction Extraction` is implemented in [backend/services/llm/extractor.py](./backend/services/llm/extractor.py).
- `Duplicate Detection` is implemented as exact-hash deduplication in [frontend/src/app/api/upload/route.js](./frontend/src/app/api/upload/route.js).
- `JSON Validation Layer`, `Merchant Normalization Engine`, and a stronger `Transaction Categorizer` are still architectural next steps. The placeholders are [backend/services/validator.py](./backend/services/validator.py), [backend/services/normalizer.py](./backend/services/normalizer.py), and [backend/services/duplicate_detector.py](./backend/services/duplicate_detector.py).
- `Analytics and AI Recommendation` is partly implemented through the analytics routes in [frontend/src/app/api/analytics](./frontend/src/app/api/analytics/). Recommendation logic is the natural next layer.

## Important Features And Modules

### Frontend Application

- [frontend/src/app](./frontend/src/app/) is the main App Router application.
- [frontend/src/app/(auth)](./frontend/src/app/%28auth%29/) contains login and registration flows.
- [frontend/src/app/(dashboard)](./frontend/src/app/%28dashboard%29/) contains the dashboard, transaction explorer, budgets view, and upload experience.
- [frontend/src/app/components](./frontend/src/app/components/) contains widget-level UI such as spending breakdown, anomaly alerts, top merchants, savings rate, and trend charts.
- [frontend/src/app/api](./frontend/src/app/api/) is the application-facing API layer for uploads, auth, and analytics.

### Backend Services

- [backend/api/routes/upload.py](./backend/api/routes/upload.py) is the statement processing entry point.
- [backend/services/ocr](./backend/services/ocr/) isolates OCR provider integration.
- [backend/services/llm](./backend/services/llm/) contains prompt and extraction logic for structured transaction output.
- [backend/services/analytics](./backend/services/analytics/) signals the future direction for backend-owned analytics services.
- [backend/workers](./backend/workers/) is the likely home for background processing once statement jobs move off the request cycle.

### Data And Auth

- [frontend/prisma/schema.prisma](./frontend/prisma/schema.prisma) is the main data model.
- [frontend/src/lib/prisma.js](./frontend/src/lib/prisma.js) manages the Prisma client.
- [frontend/src/lib/auth.js](./frontend/src/lib/auth.js) handles password hashing and JWT signing.
- [frontend/src/app/api/auth](./frontend/src/app/api/auth/) exposes registration, login, and logout endpoints.

### Techniques Worth Calling Out

- Upload forwarding uses the browser's [FormData API](https://developer.mozilla.org/docs/Web/API/FormData).
- Client-side dashboard widgets use React client components and [the `useEffect` Hook](https://react.dev/reference/react/useEffect) for fetch-on-mount data loading.
- Global styles in [frontend/src/app/globals.css](./frontend/src/app/globals.css) use [CSS custom properties](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties), [`:focus-visible`](https://developer.mozilla.org/docs/Web/CSS/:focus-visible), and [`::-webkit-scrollbar`](https://developer.mozilla.org/docs/Web/CSS/::-webkit-scrollbar).
- Navigation state in [frontend/src/app/components/Sidebar.js](./frontend/src/app/components/Sidebar.js) uses [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) with [Next.js route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups).
- The chart layer is built with [Recharts](https://recharts.org/), using responsive containers instead of fixed dimensions.

## User Experience

From the user's point of view, the product works like this:

1. Sign up or log in through the auth pages in [frontend/src/app/(auth)](./frontend/src/app/%28auth%29/).
2. Open the upload screen in [frontend/src/app/(dashboard)/upload](./frontend/src/app/%28dashboard%29/upload/).
3. Select a bank, upload a PDF statement, and submit it.
4. The app sends the file through OCR and LLM extraction, then stores the resulting transactions.
5. After processing, the dashboard updates with charts and summaries.
6. The user can inspect transactions, compare debits and credits, review top merchants, and track savings behavior over time.

The current interface is optimized around a fast first-use loop: upload a statement, process it, and move directly into analysis.

## How To Run

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Python 3](https://www.python.org/)
- A PostgreSQL database for the Prisma-backed frontend
- A [Mistral API](https://docs.mistral.ai/) key for OCR and extraction

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure environment variables

Frontend `.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/finance_dashboard
JWT_SECRET=replace-with-a-secure-secret
PYTHON_API_URL=http://127.0.0.1:8000
```

Backend `.env`:

```env
MISTRAL_API_KEY=your_mistral_api_key
CORS_ORIGINS=http://localhost:3000
```

### 4. Start the backend

```bash
cd backend
uvicorn main:app --reload
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

## Libraries And Technologies Worth Calling Out

- [Next.js](https://nextjs.org/) with the App Router in [frontend/src/app](./frontend/src/app/).
- [React](https://react.dev/) for the interactive UI.
- [Tailwind CSS v4](https://tailwindcss.com/) through the `@import "tailwindcss"` setup in [frontend/src/app/globals.css](./frontend/src/app/globals.css).
- [Prisma](https://www.prisma.io/) for the relational model in [frontend/prisma/schema.prisma](./frontend/prisma/schema.prisma).
- [Recharts](https://recharts.org/) for charts in [frontend/src/app/components](./frontend/src/app/components/).
- [FastAPI](https://fastapi.tiangolo.com/) in [backend/main.py](./backend/main.py).
- [Pydantic](https://docs.pydantic.dev/) through FastAPI request models in [backend/api/routes/auth.py](./backend/api/routes/auth.py).
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) in [frontend/src/lib](./frontend/src/lib/).
- [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with [Geist](https://vercel.com/font) in [frontend/src/app/layout.js](./frontend/src/app/layout.js).
- [Mistral OCR](https://docs.mistral.ai/capabilities/document_ai/ocr/) and the [Mistral API](https://docs.mistral.ai/) in [backend/services/ocr/extractor.py](./backend/services/ocr/extractor.py) and [backend/services/llm/extractor.py](./backend/services/llm/extractor.py).

## Project Structure

```text
.
|-- README.md
|-- backend/
|   |-- api/
|   |   `-- routes/
|   |-- auth/
|   |-- data/
|   |   `-- archive/
|   |-- db/
|   |   `-- queries/
|   |-- models/
|   |-- services/
|   |   |-- analytics/
|   |   |-- llm/
|   |   `-- ocr/
|   |-- utils/
|   `-- workers/
|-- frontend/
|   |-- prisma/
|   |-- public/
|   |   `-- uploads/
|   `-- src/
|       |-- app/
|       |   |-- (auth)/
|       |   |-- (dashboard)/
|       |   |-- api/
|       |   `-- components/
|       `-- lib/
`-- .agents/
```

Interesting directories:

- [backend/services/ocr](./backend/services/ocr/) isolates OCR concerns from the rest of the system.
- [backend/services/llm](./backend/services/llm/) contains the structured extraction logic.
- [backend/workers](./backend/workers/) is the future boundary for async statement processing.
- [frontend/src/app/api](./frontend/src/app/api/) connects browser actions to persistence and analytics.
- [frontend/src/app/components](./frontend/src/app/components/) contains the dashboard widgets.
- [frontend/prisma](./frontend/prisma/) is the clearest source of truth for the long-term product shape.
