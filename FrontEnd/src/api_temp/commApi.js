import axios from "axios";

export const fetchcommmtable = async () => {
        const response = await axios.get(
            "http://localhost:3000/api/communities"
        );
        // console.log("API Response:", response);
        return response.data;
};

export const fetchjoinedcommmtable = async () => {
    const response = await axios.get(
        "http://localhost:3000/api/joinedcommunities",
        {
            withCredentials: true 
        }
    );
    // console.log("API Response:", response);
    return response.data;
};