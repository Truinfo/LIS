import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EditResidents = () => {
    const {resident}=route.params;
    const [name, setName] = useState(resident.name);
    const [phone, setPhone] = useState(resident.phone);
    const [email, setEmail] = useState(resident.email);
    const [photo, setPhoto] = useState(resident.photo);
    const [block, setBlock] = useState(resident.block);
    const [flat, setFlat] = useState(resident.flat);
    const [apartment, setApartment] = useState(resident.apartment);

    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        const updatedResident = { name, phone, email, photo, block, flat, apartment };
        onSave(updatedResident);
    };

    return (
        <View style={styles.container}>
            <Text>Edit Resident Details</Text>

            <Button title="Pick an image" onPress={handleImagePick} />
            {photo && <Image source={{ uri: photo }} style={styles.image} />}

            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Block"
                value={block}
                onChangeText={setBlock}
                style={styles.input}
            />
            <TextInput
                placeholder="Flat"
                value={flat}
                onChangeText={setFlat}
                style={styles.input}
            />
            <TextInput
                placeholder="Apartment"
                value={apartment}
                onChangeText={setApartment}
                style={styles.input}
            />

            <Button title="Save Changes" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});

export default EditResidents;
