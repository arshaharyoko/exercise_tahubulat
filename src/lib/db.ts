import postgres from "postgres";
import { DB_CONN_STR } from "@/lib/environment"; 

const sql = postgres(DB_CONN_STR as string);

export default sql;