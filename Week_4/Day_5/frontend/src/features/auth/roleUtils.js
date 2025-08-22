export function normalizeRole(roleRaw){
  if(!roleRaw) return "user";
  const r = String(roleRaw).toLowerCase().replace(/\s+/g, "");
  if(r === "superadmin" || r === "super_admin" || r === "super-admin") return "superAdmin";
  if(r === "admin") return "admin";
  return "user";
}
