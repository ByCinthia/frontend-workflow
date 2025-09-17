// Mock API sin backend real

const fakeDB: { username: string; email: string; password: string }[] = [];

function delay(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function loginReq(payload: { username: string; password: string }) {
  await delay();
  const user = fakeDB.find(
    (u) => u.username === payload.username && u.password === payload.password
  );
  if (!user) {
    throw { response: { data: { detail: "Credenciales inválidas" } } };
  }
  return {
    access: "FAKE_TOKEN_" + user.username,
    user: { username: user.username, email: user.email },
  };
}

export async function registerReq(payload: { username: string; email: string; password: string }) {
  await delay();
  const exists = fakeDB.find((u) => u.username === payload.username || u.email === payload.email);
  if (exists) {
    throw { response: { data: { detail: "Usuario o email ya registrado" } } };
  }
  fakeDB.push(payload);
  return { ok: true, user: { username: payload.username, email: payload.email } };
}
