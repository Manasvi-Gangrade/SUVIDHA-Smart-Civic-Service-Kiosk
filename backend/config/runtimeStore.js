const crypto = require("crypto");

const state = {
  citizensById: new Map(),
  citizensByAadhaar: new Map(),
  citizensByMobile: new Map(),
  citizensByAccount: new Map(),
  sessionsByTokenHash: new Map(),
  applications: [],
  grievances: [],
  payments: [],
};

const getMockMode = () => {
  return process.env.LOCAL_MOCK_DB === "true" && !global.__SMARTCITY_DB_CONNECTED;
};

const addCitizen = (citizen) => {
  state.citizensById.set(citizen.id, citizen);
  state.citizensByAadhaar.set(citizen.aadhaar, citizen);
  state.citizensByMobile.set(citizen.mobile, citizen);
  state.citizensByAccount.set(citizen.accountId, citizen);
  return citizen;
};

const findCitizenByIdentifier = (method, value) => {
  if (method === "aadhaar") return state.citizensByAadhaar.get(value) || null;
  if (method === "mobile") return state.citizensByMobile.get(value) || null;
  if (method === "account") return state.citizensByAccount.get(value) || null;
  return null;
};

const findCitizenById = (id) => state.citizensById.get(id) || null;

const createSession = (token, citizen) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  state.sessionsByTokenHash.set(tokenHash, {
    tokenHash,
    citizen,
    isActive: true,
    lastAccessed: new Date(),
  });
};

const getSessionByToken = (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = state.sessionsByTokenHash.get(tokenHash);
  if (!session || !session.isActive) return null;
  session.lastAccessed = new Date();
  return session;
};

const deactivateSessionByToken = (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = state.sessionsByTokenHash.get(tokenHash);
  if (session) session.isActive = false;
};

module.exports = {
  state,
  getMockMode,
  addCitizen,
  findCitizenByIdentifier,
  findCitizenById,
  createSession,
  getSessionByToken,
  deactivateSessionByToken,
};
