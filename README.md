# SmartComplaint

**SmartComplaint** — Mobile + Web citizen-complaint DApp with an immutable audit trail (Hardhat, Node/Express, React, Expo, MongoDB).

A monorepo that lets citizens register (FAN hashed), submit complaints via a mobile app, and lets government officers triage, assign, and resolve complaints via a web admin dashboard. Full data is stored off-chain (MongoDB) and cryptographic digests / events are written to a smart contract for tamper-evident auditing.

---

## Key features

*   Citizen registration (FAN hashed) and complaint submission (mobile-first).
*   Web admin dashboard for government staff to triage, assign, and update complaints.
*   Smart contract ledger (Hardhat) logs complaint keys and status-change events (immutable audit).
*   Optional reward flow: release tokens/vouchers when citizens confirm resolution.
*   Runs locally (Hardhat) and can be deployed to testnets & cloud for demo.

---

## Tech stack

*   **Smart contracts:** Solidity, Hardhat
*   **Backend:** Node.js, Express, ethers.js, MongoDB (Atlas recommended)
*   **Web admin:** React (Vite)
*   **Mobile:** React Native (Expo) — Android-first
*   **Dev tools:** Git, VS Code, MetaMask, Postman/Insomnia

---

## Repository layout

```
smartcomplaint/
├─ contract/         # Hardhat project (contracts, deploy scripts)
├─ api/              # Node/Express backend (complaints, users, blockchain bridge)
├─ web-admin/        # React (Vite) admin interface
└─ mobile/           # Expo React Native app (Android)
```

---

## Quickstart — local

### Prerequisites

*   Node.js (LTS) & npm
*   Git
*   MetaMask (browser extension)
*   Android device or emulator (for Expo)
*   (Optional) MongoDB Atlas account for a cloud DB

### 1) Clone

```bash
git clone https://github.com/Temesgen-MN/smartcomplaint.git
cd smartcomplaint
```

### 2) Contracts — local chain & deploy

```bash
cd contract
npm install
npx hardhat node                 # start local Hardhat network (localhost:8545)
# in a new terminal:
npx hardhat run scripts/deploy.js --network localhost
# copy the deployed contract address from the console
```

### 3) Backend API

```bash
cd ../api
npm install
# create .env (copy from .env.sample) and set:
# MONGO_URL, RPC_URL (http://127.0.0.1:8545), PRIVATE_KEY, CONTRACT_ADDRESS, JWT_SECRET
npm run dev   # or `node src/index.js` / `nodemon src/index.js`
```

### 4) Web admin (dev)

```bash
cd ../web-admin
npm install
npm run dev
# open the Vite URL (e.g., http://localhost:5173)
```

### 5) Mobile (Expo)

```bash
cd ../mobile
npm install
npx expo start
# open with Expo Go on Android or run an Android emulator
```

---

## Environment variables (.env.sample)

```
# API / DB
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/smartcomplaint
PORT=4000
JWT_SECRET=supersecret

# Blockchain
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0x<your_hardhat_account_private_key>
CONTRACT_ADDRESS=0x<deployed_contract_address>

# Misc
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:19006
```

> **Security:** Never commit `.env` or private keys. Use secret management for production.

---

## Minimal API endpoints

```
POST   /api/auth/register-citizen    { fan, phone, selfie(optional) } -> create user, return JWT
POST   /api/auth/login               { phone } -> OTP flow
POST   /api/complaints               { fan, description, location, photos[] } -> creates DB record + logs to chain
GET    /api/complaints               ?status=&department=    (admin paginated)
GET    /api/complaints/my            (citizen)
POST   /api/complaints/:id/status    { status }  (gov worker; logs on-chain)
GET    /api/audit/:chainKey          -> audit info / tx hash
```

---

## Smart contract notes (important)

*   **Do not store raw PII on-chain.** Store only cryptographic digests (e.g., `keccak256(fan)`) and small pointers/keys (e.g., `sha256(dbId)`).
*   Contract should emit events (`ComplaintLogged`, `StatusUpdated`) that backend listens to and stores tx metadata.
*   Use a local Hardhat network or Ganache for testing, then deploy to a testnet (Sepolia / Polygon Mumbai) for public demos.

---

## Data & identity model (high level)

*   **Citizen:** verified via FAN (hash stored), phone number for OTP, linked wallet optional. Can submit and verify complaints.
*   **Gov worker:** accounts created by SuperAdmin (top-down). Roles stored in DB and mirrored on-chain for critical actions.
*   **Complaint:** DB record contains full text, photos (S3/Cloud storage), location, priority, and `chainKey` (hash of DB id). Smart contract logs the `fanHash` + `dbId` key only.

---

## Security & privacy (quick checklist)

*   Hash FAN before any on-chain action (`ethers.utils.keccak256` or equivalent).
*   Encrypt sensitive fields at rest (MongoDB field-level or application-level encryption).
*   Protect privileged routes with RBAC & MFA for admin accounts.
*   Rate-limit submissions and add anti-spam checks.
*   Audit all admin and role-change actions (store as DB records and consider emitting on-chain events for critical actions).

---

## Deployment suggestions

*   **Contracts:** Hardhat → Sepolia or Polygon Mumbai via Alchemy/Infura.
*   **API:** Railway / Render / Heroku (free-tier possible) or a VPS.
*   **Web admin:** Vercel / Netlify.
*   **Mobile:** Expo for quick distribution; build APK for Play Store if desired.
*   **DB:** MongoDB Atlas free tier.

---

## Roadmap & next steps

*   Add SMS/OTP onboarding (Twilio / mock during demo).
*   Implement ID capture + OCR (optional). Do NOT store raw ID images on-chain.
*   Add automatic triage (basic NLP rules first, ML later).
*   Implement reward escrow & secure treasury for token payouts.
*   Contract audit before any mainnet deployment.

---

## Contributing

1.  Fork the repository
2.  Create a feature branch: `git checkout -b feat/your-feature`
3.  Commit and push your changes
4.  Open a Pull Request describing the change and the demo

Please follow the code style and add tests for any contract changes.

---

## License

This project is released under the **MIT License**. See the [LICENSE](LICENSE) file.

---

## Contact

If you need help running the project or want a stripped starter repo (deployable in <30 minutes), open an issue or contact **Temesgen-MN**.

---
