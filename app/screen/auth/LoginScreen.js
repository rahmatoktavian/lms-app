import React, { useState } from 'react';
import { withTheme, Appbar, TextInput, HelperText, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';

import { supabase } from '../../config/supabase';
import Loader from '../../comp/Loader';

function HomeScreen({ navigation, theme }) {
	const [loading, setLoading] = useState(false);
	const [hidePassword, setHidePassword] = useState(true);

	const onLogin = async(values) => {
		setLoading(true)
		const { error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password,
		})
		
		if (error) {
			Dialog.show({
				type: ALERT_TYPE.WARNING,
				title: error.message,
				button: 'Close',
			})
		}
		setLoading(false)
	}
	
	return (
		<>
			<Appbar.Header>
				<Appbar.Content title="LMS Login" />
			</Appbar.Header>
			
			<Loader loading={loading} />

			<Formik
				initialValues={{
					email: '', 
					password: '' 
				}}
				enableReinitialize
				validationSchema={yup.object().shape({
				email: yup
					.string()
					.email()
					.required(),
				password: yup
					.string()
					.min(6)
					.required(),
				})}
				onSubmit={values => onLogin(values)}
			>
			{({ handleSubmit, handleBlur, handleChange, values, errors, touched, isValid }) => (
			<>
				<TextInput
					label="Email"
					value={values.email}
					onChangeText={handleChange('email')}
					onBlur={handleBlur('email')}
					error={errors.email ? true : false}
					style={{margin:10}}
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
					style={{margin:10}}
				/>
				{errors.password && <HelperText type="error">{errors.password}</HelperText>}
				<Button mode="contained" disabled={!isValid} onPress={handleSubmit} style={{margin:10}}>
					Login
				</Button>
			</>
			)}
			</Formik>
		</>
	);
}

export default withTheme(HomeScreen)