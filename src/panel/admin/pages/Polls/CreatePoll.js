import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';

const CreatePoll = ({ navigation }) => {
    const [formData, setFormData] = useState({
        question: '',
        description: '',
        option: [''], // Start with one empty option
        endDate: '',
        time: '',
        type: '',
        block: '',
    });

    const handleFormChange = (name, value, index) => {
        if (name === 'option') {
            const updatedOptions = [...formData.option];
            updatedOptions[index] = value;
            setFormData({ ...formData, option: updatedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddOption = () => {
        setFormData(prevData => ({
            ...prevData,
            option: [...prevData.option, ''], // Add a new empty option
        }));
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = formData.option.filter((_, i) => i !== index);
        setFormData({ ...formData, option: updatedOptions });
    };

    const handleFormSubmit = () => {
        // Handle poll creation logic here
        Alert.alert('Poll Created', JSON.stringify(formData, null, 2));
        // After submitting, you might want to navigate back or reset the form
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create New Poll</Text>
            <TextInput
                placeholder="Poll Question"
                value={formData.question}
                onChangeText={text => handleFormChange('question', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Poll Description"
                value={formData.description}
                onChangeText={text => handleFormChange('description', text)}
                style={styles.input}
            />
            {formData.option.map((opt, index) => (
                <View key={index} style={styles.optionContainer}>
                    <TextInput
                        placeholder={`Option ${index + 1}`}
                        value={opt}
                        onChangeText={text => handleFormChange('option', text, index)}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveOption(index)}>
                        <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={handleAddOption}>
                <Text style={styles.addButtonText}>Add Option</Text>
            </TouchableOpacity>
            <TextInput
                placeholder="End Date"
                value={formData.endDate}
                onChangeText={text => handleFormChange('endDate', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Time"
                value={formData.time}
                onChangeText={text => handleFormChange('time', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Poll Type"
                value={formData.type}
                onChangeText={text => handleFormChange('type', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Block"
                value={formData.block}
                onChangeText={text => handleFormChange('block', text)}
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
                    <Text style={styles.submitButtonText}>Create Poll</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        height: 50, // Adjust the height as needed
    },
    removeButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default CreatePoll;
