import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const getLinks = async () => {
  const { error } = await supabase
    .from("links")
    .select()
    .order("id", { ascending: false })
    .limit(10);
  if (error) return false;
  return true;
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

export { getLinks, insertLink };
