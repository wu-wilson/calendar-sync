import axios from "axios";

export type counts = {
  count_total: number;
  count_completed: string;
  day_id: string;
};

// Convert the number of items in each day into a hashtable
const buildHashtable = async (user_id: string) => {
  const table: { [key: string]: counts } = {};
  // Store the count of items in each day in data
  const { data }: { data: counts[] } = await axios
    .get(`${process.env.REACT_APP_API_URL}/count/${user_id}`)
    .then();
  // Put the counts into table
  data.forEach((elem) => (table[elem.day_id] = elem));
  return table;
};

export default buildHashtable;
