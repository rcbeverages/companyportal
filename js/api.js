// api.js

// ===================
// API ENDPOINTS
// ===================
const API = {
  USERS: "https://sheetdb.io/api/v1/abgzvmn3160g0",
  STORE_RANGING: "https://sheetdb.io/api/v1/2p0phuvm9dz42",
  SCHEDULED_CALLS: "https://sheetdb.io/api/v1/9envyaeemiz9h",
  PRE_ORDERS: "https://sheetdb.io/api/v1/autq91pb2wsab",
  VISIT_LOGS: "https://sheetdb.io/api/v1/3jn3pg6hok7hj",
  PROMO_SHEET: "https://sheetdb.io/api/v1/98o62avm5tgtx",
  EMAIL_REMINDERS: "https://sheetdb.io/api/v1/lkhkbez8p8el9",
  ASSET_LOG: "https://sheetdb.io/api/v1/8kwtvisrhm2zd",
  MASTER_STORE_LIST: "https://sheetdb.io/api/v1/8ba1eug88u4y1",
  ARCADE_LEADERBOARD: "https://sheetdb.io/api/v1/m2stlpl38zxyx",
  KEY_ACCOUNT: "https://sheetdb.io/api/v1/hklellq80sjc7"
};

// ===================
// API FUNCTIONS
// ===================

// Fetch users (for login)
async function fetchUsers() {
  try {
    const response = await fetch(API.USERS);
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Fetch full store list
async function fetchMasterStoreList() {
  try {
    const response = await fetch(API.MASTER_STORE_LIST);
    const stores = await response.json();
    return stores;
  } catch (error) {
    console.error("Error fetching master store list:", error);
    return [];
  }
}

// Fetch scheduled calls (for journey planner)
async function fetchScheduledCalls() {
  try {
    const response = await fetch(API.SCHEDULED_CALLS);
    const calls = await response.json();
    return calls;
  } catch (error) {
    console.error("Error fetching scheduled calls:", error);
    return [];
  }
}

// Fetch current promos
async function fetchPromos() {
  try {
    const response = await fetch(API.PROMO_SHEET);
    const promos = await response.json();
    return promos;
  } catch (error) {
    console.error("Error fetching promos:", error);
    return [];
  }
}

// Fetch preorders
async function fetchPreOrders() {
  try {
    const response = await fetch(API.PRE_ORDERS);
    const preorders = await response.json();
    return preorders;
  } catch (error) {
    console.error("Error fetching preorders:", error);
    return [];
  }
}

// Fetch visit logs
async function fetchVisitLogs() {
  try {
    const response = await fetch(API.VISIT_LOGS);
    const logs = await response.json();
    return logs;
  } catch (error) {
    console.error("Error fetching visit logs:", error);
    return [];
  }
}

// Fetch asset logs
async function fetchAssetLogs() {
  try {
    const response = await fetch(API.ASSET_LOG);
    const assets = await response.json();
    return assets;
  } catch (error) {
    console.error("Error fetching asset logs:", error);
    return [];
  }
}

// Fetch email reminders
async function fetchEmailReminders() {
  try {
    const response = await fetch(API.EMAIL_REMINDERS);
    const reminders = await response.json();
    return reminders;
  } catch (error) {
    console.error("Error fetching email reminders:", error);
    return [];
  }
}

// Fetch arcade leaderboard
async function fetchLeaderboard() {
  try {
    const response = await fetch(API.ARCADE_LEADERBOARD);
    const leaderboard = await response.json();
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
