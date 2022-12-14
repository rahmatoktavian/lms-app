import { supabase } from "../config/supabase";

const getSession = async () => {
	const { data, error } = await supabase.auth.getSession()
	const userId = data.session.user.id;

	const { data: userData, error: userError } = await supabase
		.from('peserta')
		.select('id,nama,telpon')
		.eq('auth_uid', userId)
		.single();

	let result = userData;
	return result;
}

export default getSession;
