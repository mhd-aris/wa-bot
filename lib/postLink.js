import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

const getLinks = async () => {
  const { data, error } = await supabase
    .from("links")
    .select()
    .order("id", { ascending: false })
    .limit(10);
  if (error) return false;
  return data;
};

const insertLink = async (link) => {
  const { error } = await supabase.from("links").insert([
    {
      link,
    },
  ]);
  if (error) return false;
  return true;
};
getLinks();
export { getLinks, insertLink };
