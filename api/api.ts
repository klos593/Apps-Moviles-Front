import { ProfessionalCardData } from "@/components/Types/ProfessionalCardData";
import { ProfessionalData } from "@/components/Types/ProfessionalData";
import { ProfessionCardData } from "@/components/Types/ProfessionCardData";
import ServiceCardData from "@/components/Types/ServiceCardData";
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
    const response = await fetch(`${URL}/professional/${encodeURIComponent(id)}`);
    return response.json();
}

export async function getUser(email: string): Promise<UserData> {

    const response = await fetch(`${URL}/user/${encodeURIComponent(email)}`);
    return response.json();
}

export async function getProfessionalsWithProfession(profession: string): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals/${encodeURIComponent(profession)}`);
    return response.json();
}


export async function updateUser(email: string, body: {name:string; lastName:string; phone:string; street:string, number:number}): Promise<UserData> {
  const res = await fetch(`${URL}/user/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("No se pudo actualizar");
  return res.json();
}

export async function getFinishedUsedServices(email: string): Promise<ServiceCardData[]> {
    const response = await fetch(`${URL}/finishedUsedServices/${encodeURIComponent(email)}`);
    return response.json();
}