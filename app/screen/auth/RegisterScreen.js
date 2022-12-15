import React, { useState } from 'react';
import { withTheme, Appbar, TextInput, HelperText, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';

import { supabase } from '../../config/supabase';
import Loader from '../../comp/Loader';

function RegisterScreen({ navigation, theme }) {
	const [loading, setLoading] = useState(false);
	const [hidePassword, setHidePassword] = useState(true);

	const onRegister = async (values) => {
		setLoading(true)

		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: values.email,
			password: values.password,
		})

		const { error: registerErr } = await supabase
			.from('peserta')
			.insert({ auth_uid: authData.user.id, nama: values.fullname, telpon: values.phone, tanggal_gabung: new Date() })

		if (!registerErr) {
			Dialog.show({
				type: ALERT_TYPE.SUCCESS,
				title: 'Berhasil Mendaftarkan Akun, Silahkan login',
				button: 'Ok',
			})
			await navigation.navigate('LoginScreen');
		} else {
			Dialog.show({
				type: ALERT_TYPE.WARNING,
				title: error.message,
				button: 'Ok',
			})
		}


		setLoading(false)
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title="LMS Register" />
			</Appbar.Header>

			<Loader loading={loading} />

			<Formik
				initialValues={{
					email: '',
					password: ''
				}}
				enableReinitialize
				validationSchema={yup.object().shape({
					fullname: yup
						.string()
						.required(),
					phone: yup
						.number()
						.required()
						.positive(),
					email: yup
						.string()
						.email()
						.required(),
					password: yup
						.string()
						.min(6)
						.required(),
				})}
				onSubmit={values => onRegister(values)}
			>
				{({ handleSubmit, handleBlur, handleChange, values, errors, touched, isValid }) => (
					<>
						<TextInput
							label="Nama Lengkap"
							value={values.fullname}
							onChangeText={handleChange('fullname')}
							onBlur={handleBlur('fullname')}
							error={errors.fullname ? true : false}
							style={{ margin: 10 }}
						/>
						{errors.fullname && <HelperText type="error">{errors.fullname}</HelperText>}
						<TextInput
							label="Nomor Telepon"
							value={values.phone}
							onChangeText={handleChange('phone')}
							onBlur={handleBlur('phone')}
							error={errors.phone ? true : false}
							style={{ margin: 10 }}
						/>
						{errors.phone && <HelperText type="error">{errors.phone}</HelperText>}
						<TextInput
							label="Email"
							value={values.email}
							onChangeText={handleChange('email')}
							onBlur={handleBlur('email')}
							error={errors.email ? true : false}
							style={{ margin: 10 }}
						/>
						{errors.email && <HelperText type="error">{errors.email}</HelperText>}
						<TextInput
							label="Password"
							value={values.password}
							onChangeText={handleChange('password')}
							onBlur={handleBlur('password')}
							secureTextEntry={hidePassword}
							error={errors.password ? true : false}
							right={<TextInput.Icon icon={hidePassword ? 'eye' : 'eye-off'} onPress={() => setHidePassword(!hidePassword)} />}
							style={{ margin: 10 }}
						/>
						{errors.password && <HelperText type="error">{errors.password}</HelperText>}
						<Button mode="contained" disabled={!isValid} onPress={handleSubmit} style={{ margin: 10 }}>Register</Button>
					</>
				)}
			</Formik>
		</>
	);
}

export default withTheme(RegisterScreen)