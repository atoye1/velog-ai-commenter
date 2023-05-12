import axios from "axios";

export const fetchData = async (uri: string) => {
  try {
    const response = await axios.get(uri);
    const data = response.data;
    // Process the data or perform any additional operations
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
