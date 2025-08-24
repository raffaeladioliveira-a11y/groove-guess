const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length: number = 6): string {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * ALPHANUM.length);
    code += ALPHANUM[index];
  }
  return code;
}
