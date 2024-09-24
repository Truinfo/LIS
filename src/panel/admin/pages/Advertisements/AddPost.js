// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, Picker, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { createAdvertisements } from './AdvertisementSlice';
// import { fetchResidentProfile } from '../Profile/profileSlice';
// import Dialog from '../../DialogBox/DialogBox';

// const AddAdvertisements = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     societyId: '6683b57b073739a31e8350d0',
//     adv: "",
//     phoneNumber: "",
//     userName: "",
//     status: "",
//     details: {
//       block: '',
//       flat_No: '',
//       flat_Area: '',
//       rooms: '',
//       washrooms: '',
//       price: '',
//       maintainancePrice: '',
//       parkingSpace: '',
//     },
//     pictures: [],
//     picturePreviews: [],
//   });

//   const profileData = useSelector(state => state.profile.profile);
//   const [blockOptions, setBlockOptions] = useState([]);
//   const [flatOptions, setFlatOptions] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showDialog, setShowDialog] = useState(false);
//   const successMessage = useSelector((state) => state.advertisements.successMessage || state.advertisements.error);

//   const statusOptions = ['Occupied', 'Unoccupied'];
//   const roomOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];

//   useEffect(() => {
//     dispatch(fetchResidentProfile());
//   }, [dispatch]);

//   useEffect(() => {
//     if (profileData.blocks) {
//       setBlockOptions(profileData.blocks.map(block => block.blockName));
//     }
//   }, [profileData.blocks]);

//   useEffect(() => {
//     const selectedBlock = profileData.blocks?.find(block => block.blockName === formData.details.block);
//     if (selectedBlock) {
//       setFlatOptions(selectedBlock.flats.map(flat => flat.flatNumber));
//     } else {
//       setFlatOptions([]);
//     }
//   }, [formData.details.block, profileData.blocks]);

//   const handleChange = (name, value) => {
//     if (name.startsWith('details.')) {
//       const detailsKey = name.split('.')[1];
//       setFormData(prevFormData => ({
//         ...prevFormData,
//         details: {
//           ...prevFormData.details,
//           [detailsKey]: value,
//         },
//       }));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleFileChange = (newPictures) => {
//     if (newPictures.length + formData.pictures.length > 5) {
//       Alert.alert("You can upload a maximum of 5 pictures.");
//       return;
//     }

//     const updatedPictures = [...formData.pictures, ...newPictures];
//     const updatedPicturePreviews = newPictures.map(file => URL.createObjectURL(file));

//     setFormData(prevFormData => ({
//       ...prevFormData,
//       pictures: updatedPictures.slice(-5),
//       picturePreviews: [...prevFormData.picturePreviews.slice(-5), ...updatedPicturePreviews],
//     }));
//   };

//   const handleSubmit = () => {
//     const newErrors = {};
//     Object.keys(formData).forEach(key => {
//       if (!formData[key] && key !== 'details' && key !== 'pictures') {
//         newErrors[key] = 'This field is required';
//       }
//     });
//     Object.keys(formData.details).forEach(key => {
//       if (!formData.details[key]) {
//         newErrors[`details.${key}`] = 'This field is required';
//       }
//     });
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     const submissionData = new FormData();
//     submissionData.append('societyId', formData.societyId);
//     submissionData.append('adv', formData.adv);
//     submissionData.append('userName', formData.userName);
//     submissionData.append('status', formData.status);
//     submissionData.append('phoneNumber', formData.phoneNumber);
//     submissionData.append('details', JSON.stringify(formData.details));

//     formData.pictures.forEach(picture => {
//       submissionData.append('pictures', picture);
//     });

//     dispatch(createAdvertisements(submissionData)).then((response) => {
//       if (response.meta.requestStatus === 'fulfilled') {
//         setFormData({
//           societyId: '6683b57b073739a31e8350d0',
//           adv: "",
//           phoneNumber: "",
//           userName: "",
//           status: "",
//           details: {
//             block: '',
//             flat_No: '',
//             flat_Area: '',
//             rooms: '',
//             washrooms: '',
//             price: '',
//             maintainancePrice: '',
//             parkingSpace: '',
//           },
//           pictures: [],
//           picturePreviews: [],
//         });
//         setShowDialog(true);
//         setTimeout(() => {
//           setShowDialog(false);
//           navigation.navigate("AddsList"); // Adjust this based on your navigation structure
//         }, 2000);
//       } else {
//         setShowDialog(true);
//         setTimeout(() => {
//           setShowDialog(false);
//         }, 2000);
//       }
//     }).catch((error) => {
//       console.error('Error:', error);
//     });
//   };

//   return (
//     <ScrollView>
//       <View>
//         <Text>Add Advertisements</Text>
//         <Picker selectedValue={formData.adv} onValueChange={(itemValue) => handleChange('adv', itemValue)}>
//           <Picker.Item label="Select Advertisement" value="" />
//           <Picker.Item label="Rent" value="Rent" />
//           <Picker.Item label="Sale" value="Sale" />
//         </Picker>
//         <TextInput placeholder="User Name" value={formData.userName} onChangeText={(text) => handleChange('userName', text)} />
//         <TextInput placeholder="Mobile Number" value={formData.phoneNumber} onChangeText={(text) => handleChange('phoneNumber', text)} />
        
//         <Picker selectedValue={formData.status} onValueChange={(itemValue) => handleChange('status', itemValue)}>
//           <Picker.Item label="Select Status" value="" />
//           {statusOptions.map(status => <Picker.Item key={status} label={status} value={status} />)}
//         </Picker>
        
//         <Picker selectedValue={formData.details.block} onValueChange={(itemValue) => handleChange('details.block', itemValue)}>
//           <Picker.Item label="Select Block" value="" />
//           {blockOptions.map(block => <Picker.Item key={block} label={block} value={block} />)}
//         </Picker>

//         <Picker selectedValue={formData.details.flat_No} onValueChange={(itemValue) => handleChange('details.flat_No', itemValue)}>
//           <Picker.Item label="Select Flat Number" value="" />
//           {flatOptions.map(flat => <Picker.Item key={flat} label={flat} value={flat} />)}
//         </Picker>

//         <TextInput placeholder="Flat Area" value={formData.details.flat_Area} onChangeText={(text) => handleChange('details.flat_Area', text)} />
//         <Picker selectedValue={formData.details.rooms} onValueChange={(itemValue) => handleChange('details.rooms', itemValue)}>
//           <Picker.Item label="Select Rooms" value="" />
//           {roomOptions.map(room => <Picker.Item key={room} label={room} value={room} />)}
//         </Picker>

//         <TextInput placeholder="Washrooms" value={formData.details.washrooms} onChangeText={(text) => handleChange('details.washrooms', text)} />
//         <TextInput placeholder="Price" value={formData.details.price} onChangeText={(text) => handleChange('details.price', text)} />
//         <TextInput placeholder="Maintenance Price" value={formData.details.maintainancePrice} onChangeText={(text) => handleChange('details.maintainancePrice', text)} />
//         <TextInput placeholder="Parking Space" value={formData.details.parkingSpace} onChangeText={(text) => handleChange('details.parkingSpace', text)} />

//         {/* File Upload handling can be done using libraries like 'react-native-image-picker' */}

//         <Button title="Add" onPress={handleSubmit} />
//       </View>

//       <Dialog message={successMessage} showDialog={showDialog} onClose={() => setShowDialog(false)} />
//     </ScrollView>
//   );
// };

// export default AddAdvertisements;
