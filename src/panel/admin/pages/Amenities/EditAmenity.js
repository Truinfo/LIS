import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker"; // Import image picker
import {
  getAmenityById,
  updateAmenity,
} from "./AmenitiesSlice";
import { ImagebaseURL } from "../../../Security/helpers/axios";
import { Snackbar } from "react-native-paper";

const EditAmenity = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const amenity = useSelector((state) => state.adminAmenities.amenities);
  const successMessage = useSelector(
    (state) => state.adminAmenities.successMessage
  );

  const [formData, setFormData] = useState({
    societyId: "",
    image: "",
    amenityName: "",
    capacity: "",
    timings: "",
    location: "",
    cost: "",
    status: "",
  });

  const [previewImages, setPreviewImages] = useState("");
  const [newFilesSelected, setNewFilesSelected] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false); // Snackbar visibility state
  const [snackMessage, setSnackMessage] = useState(""); // Snackbar message

  // Request permission to access media library
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  useEffect(() => {
    requestPermission();
    dispatch(getAmenityById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (amenity) {
      setFormData({
        societyId: amenity.societyId || "",
        image: amenity.image || "",
        amenityName: amenity.amenityName || "",
        capacity: amenity.capacity || "",
        timings: amenity.timings || "",
        location: amenity.location || "",
        cost: amenity.cost || "",
        status: amenity.status || "",
      });

      const imagePreviews = amenity.image
        ? `${ImagebaseURL}${amenity.image}` : null
      setPreviewImages(imagePreviews);
    }
  }, [amenity]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewImages(result.assets[0].uri);
      setNewFilesSelected(result.assets[0]);
    }
  };


  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Correctly reference the state values
    formDataToSend.append('societyId', formData.societyId);
    formDataToSend.append('amenityName', formData.amenityName);
    formDataToSend.append('capacity', formData.capacity);
    formDataToSend.append('timings', formData.timings);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('cost', formData.cost);
    formDataToSend.append('status', formData.status);
  
    // Only append the image if it was changed
    if (newFilesSelected) {
      formDataToSend.append('image', {
        uri: previewImages,
        name: `image_${id}.jpg`,
        type: 'image/jpeg',
      });
    }

    try {
      const response = await dispatch(updateAmenity({ id, formData: formDataToSend }));
      console.log(response)
      if (response.type === "amenities/updateAmenity/fulfilled") {
        setSnackMessage(successMessage || "Updated successfully");
        setSnackVisible(true); // Show the Snackbar
        dispatch(getAmenityById(id));
        navigation.goBack(); // Navigate back after successful update
      }
    } catch (error) {
      console.error("Error:", error.message);
      setSnackMessage("Update failed. Please try again."); // Set error message
      setSnackVisible(true); // Show Snackbar on error
    }
  };

  // const handleSubmit = () => {
  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     if (key !== "image") {
  //       data.append(key, formData[key]);
  //     } else if (newFilesSelected && formData[key]) {
  //       if (formData[key].startsWith("http")) {
  //         // Check if it is a valid URI
  //         data.append("image", {
  //           uri: formData[key],
  //           name: `image_${id}.jpg`,
  //           type: "image/jpeg",
  //         });
  //       } else {
  //         console.error("Invalid image URI:", formData[key]);
  //       }
  //     }
  //   });

  //   dispatch(updateAmenity({ id, formData: data }))
  //     .then((response) => {
  //       if (response.type === "amenities/updateAmenity/fulfilled") {
  //         setSnackMessage(successMessage || "Updated successfully");
  //         setSnackVisible(true); // Show the Snackbar
  //         dispatch(getAmenityById(id));
  //         navigation.goBack(); // Navigate back after successful update
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       setSnackMessage("Update failed. Please try again."); // Set error message
  //       setSnackVisible(true); // Show Snackbar on error
  //     });
  // };
  const onDismissSnackBar = () => setSnackVisible(false); // Dismiss the Snackbar

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Image Preview */}
        <View style={styles.imagePreviewContainer}>
          {/* {previewImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.imagePreview}
            />
          ))} */}
          <Image
            source={{ uri: newFilesSelected ? newFilesSelected : previewImages }}
            style={styles.imagePreview}
          />
        </View>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage} // Call the image picker function
        >
          <Text style={styles.uploadButtonText}>Upload Image</Text>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Society ID"
            value={formData.societyId}
            onChangeText={(value) => handleChange("societyId", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Amenity Name"
            value={formData.amenityName}
            onChangeText={(value) => handleChange("amenityName", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Capacity"
            value={formData.capacity}
            keyboardType="numeric"
            onChangeText={(value) => handleChange("capacity", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Timings"
            value={formData.timings}
            onChangeText={(value) => handleChange("timings", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={formData.location}
            onChangeText={(value) => handleChange("location", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost"
            value={formData.cost}
            onChangeText={(value) => handleChange("cost", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Status"
            value={formData.status}
            onChangeText={(value) => handleChange("status", value)}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Snackbar Component */}
      <Snackbar
        visible={snackVisible}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContainer: {
    paddingBottom: 40,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 350,
    height: 200,
    borderRadius: 10,
  },
  uploadButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#630000",
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#630000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EditAmenity;
