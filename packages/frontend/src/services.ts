import { IRoom } from "secure-coinflip-backend/database"

const BASE_URI = "http://localhost:3001"

export const Services = {
    getRooms: async () => {
        const response = await fetch(`${BASE_URI}/rooms`, {
            method: "GET",
        })

        return response.json()
    },

    createRoom: async (username: string): Promise<IRoom> => {
        const response = await fetch(`${BASE_URI}/createRoom`, {
            method: "POST",
            body: JSON.stringify({ username }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response.json()
    },

    getRoom: async (id: string) => {
        const response = await fetch(`${BASE_URI}/rooms/${id}`, {
            method: "GET",
        })

        return response.json()
    },
}
