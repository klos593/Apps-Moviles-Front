import { ProfessionalCardData } from "@/components/Types/ProfessionalCardData";
import { ProfessionalData } from "@/components/Types/ProfessionalData";
import { ProfessionCardData } from "@/components/Types/ProfessionCardData";
import { UserData } from "@/components/Types/UserData";
import { URL } from "./url";


export async function getProfessionals(): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals`);
    return response.json();
}

export async function getProfessions(): Promise<ProfessionCardData[]> {
    const response = await fetch(`${URL}/professions`);
    return response.json();
}

export async function getProfessionalWithId(id: string): Promise<ProfessionalData> {
    const response = await fetch(`${URL}/professional/${id}`);
    return response.json();
}

export async function getUser(email: string): Promise<UserData> {

    const response = await fetch(`${URL}/user/${email}`);
    return response.json();
}

export async function getProfessionalsWithProfession(profession: string): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals/${profession}`);
    return response.json();
}

// --- Ejemplo simple de API para actualizar (ajustá URL/body según tu backend) ---
export async function updateUser(id: string, payload: {
  name: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || ""}/user/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
