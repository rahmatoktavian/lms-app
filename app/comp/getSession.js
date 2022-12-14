import { supabase } from "../config/supabase";

const getSession = async() => {
	const { data, error } = await supabase.auth.getSession()
	const user_id = data.session.user.id;
	
	//selecr peserta eq auth uid
	
	let result = user_id;
	return result;
}

export default getSession;
