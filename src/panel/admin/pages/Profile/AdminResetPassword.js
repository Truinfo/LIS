import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure to install react-native-vector-icons
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux
import { resetPassword } from './resetPasswordSlice';
const AdminResetPassword = () => {
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [formErrors, setFormErrors] = useState({});
    const [formValues, setFormValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const dispatch = useDispatch();

    const togglePasswordVisibility = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleInputChange = (name, value) => {
        setFormValues(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const errors = {
            currentPassword: formValues.currentPassword === "",
            newPassword: formValues.newPassword === "",
            confirmPassword: formValues.confirmPassword === "",
            passwordMismatch: formValues.newPassword !== formValues.confirmPassword,
        };
        setFormErrors(errors);
        const isValid = !Object.values(errors).some((error) => error);
        try {
            if (!errors.passwordMismatch) {
                if (isValid) {
                    // Optional: If you want to close an expanded view
                    // setExpanded(false);
                }
                const result = await dispatch(resetPassword({
                    currentPassword: formValues.currentPassword,
                    password: formValues.newPassword,
                }));
                console.log(formValues.currentPassword, formValues.newPassword,result)

                if (result.type === "resetPassword/reset/fulfilled") {
                    setFormValues({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    });
                    // Optional: Show success message
                    Alert.alert("Success", "Password changed successfully!");
                } else {
                    // Optional: Show error message
                    Alert.alert("Error", "Failed to change password.");
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword.currentPassword}
                    placeholder="Current Password"
                    onChangeText={(text) => handleInputChange("currentPassword", text)}
                />
                <TouchableOpacity onPress={() => togglePasswordVisibility("currentPassword")}>
                    <Icon
                        name={showPassword.currentPassword ? "visibility-off" : "visibility"}
                        size={24}
                    />
                </TouchableOpacity>
                {formErrors.currentPassword && (
                    <Text style={styles.errorText}>Current password is required</Text>
                )}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword.newPassword}
                    placeholder="New Password"
                    onChangeText={(text) => handleInputChange("newPassword", text)}
                />
                <TouchableOpacity onPress={() => togglePasswordVisibility("newPassword")}>
                    <Icon
                        name={showPassword.newPassword ? "visibility-off" : "visibility"}
                        size={24}
                    />
                </TouchableOpacity>
                {formErrors.newPassword && (
                    <Text style={styles.errorText}>New password is required</Text>
                )}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword.confirmPassword}
                    placeholder="Confirm New Password"
                    onChangeText={(text) => handleInputChange("confirmPassword", text)}
                />
                <TouchableOpacity onPress={() => togglePasswordVisibility("confirmPassword")}>
                    <Icon
                        name={showPassword.confirmPassword ? "visibility-off" : "visibility"}
                        size={24}
                    />
                </TouchableOpacity>
                {formErrors.confirmPassword && (
                    <Text style={styles.errorText}>Confirming your new password is required</Text>
                )}
                {formErrors.passwordMismatch && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                )}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        marginLeft: 10,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AdminResetPassword;
