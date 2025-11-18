import Address from "./Address";

export type ServiceInfo = {        
        id: string;
        provider: {
            name: string;
            lastName: string;
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