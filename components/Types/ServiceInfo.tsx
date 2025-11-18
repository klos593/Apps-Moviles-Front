import Address from "./Address";

export type ServiceInfo = {        
        id: string;
        provider: {
            id: number;
            name: string;
            lastName: string;
            phone: string;
            email: string;
        },
        user: {
            name: string;
            lastName: string;
        }
        profession: {
            name: string;
        },
        date: string;
        state: string;
        address: Address;
        price: number;
        rating: number;
        comment:string;
    };