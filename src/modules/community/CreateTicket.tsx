import React, { useState } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonLabel, IonItem, IonInput, IonTextarea, IonButton, IonIcon, IonImg, IonRadio, IonRadioGroup, IonList } from '@ionic/react';
import { attach } from 'ionicons/icons';

const CreateTicket: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [flatNumber, setFlatNumber] = useState<string>('');
    const [blockNumber, setBlockNumber] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<(string | ArrayBuffer)[]>([]);
    const [selectedRadio, setSelectedRadio] = useState<'personal' | 'community'>('personal');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (files.length > 0) {
            setSelectedImages(prev => [...prev, ...files]);

            // Create preview URLs for the selected images
            const newPreviews: (string | ArrayBuffer)[] = [];
            const reader = new FileReader();

            files.forEach((file, index) => {
                reader.onloadend = () => {
                    if (reader.result) {
                        newPreviews[index] = reader.result;
                        if (index === files.length - 1) {
                            setImagePreviews(prev => [...prev, ...newPreviews]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted with:', {
            selectedCategory,
            flatNumber,
            blockNumber,
            description,
            selectedImages,
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Create Ticket</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen style={{ paddingBottom: '80px' }}> {/* Add padding for the submit button */}
                <form onSubmit={handleSubmit}>
                    <IonList>
                        <IonItem>
                            <IonLabel>Type</IonLabel>
                            <IonRadioGroup value={selectedRadio} onIonChange={e => setSelectedRadio(e.detail.value)}>
                                <IonItem>
                                    <IonLabel>Personal</IonLabel>
                                    <IonRadio slot="start" value="personal" />
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Community</IonLabel>
                                    <IonRadio slot="start" value="community" />
                                </IonItem>
                            </IonRadioGroup>
                        </IonItem>
                    </IonList>
                    {selectedRadio === 'community' && (
                        <IonItem>
                            <IonLabel>Category</IonLabel>
                            <IonSelect
                                value={selectedCategory}
                                placeholder="Select a category"
                                onIonChange={e => setSelectedCategory(e.detail.value)}
                            >
                                <IonSelectOption value="general_inquiry">General Inquiry</IonSelectOption>
                                <IonSelectOption value="maintenance_request">Maintenance Request</IonSelectOption>
                                <IonSelectOption value="security_concern">Security Concern</IonSelectOption>
                                <IonSelectOption value="billing_issue">Billing Issue</IonSelectOption>
                                <IonSelectOption value="noise_complaint">Noise Complaint</IonSelectOption>
                                <IonSelectOption value="parking_issue">Parking Issue</IonSelectOption>
                                <IonSelectOption value="public_spaces">Public Spaces</IonSelectOption>
                                <IonSelectOption value="trash_recycling">Trash and Recycling</IonSelectOption>
                                <IonSelectOption value="facility_booking">Facility Booking</IonSelectOption>
                                <IonSelectOption value="neighbor_dispute">Neighbor Dispute</IonSelectOption>
                                <IonSelectOption value="event_organization">Event Organization</IonSelectOption>
                                <IonSelectOption value="communication_issue">Communication Issue</IonSelectOption>
                                <IonSelectOption value="utility_issues">Utility Issues</IonSelectOption>
                                <IonSelectOption value="animal_control">Animal Control</IonSelectOption>
                                <IonSelectOption value="health_safety">Health and Safety</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    )}
                    <IonItem>
                        <IonLabel position="floating">Flat Number</IonLabel>
                        <IonInput
                            value={flatNumber}
                            onIonInput={e => setFlatNumber(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Block Number</IonLabel>
                        <IonInput
                            value={blockNumber}
                            onIonInput={e => setBlockNumber(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Description</IonLabel>
                        <IonTextarea
                            value={description}
                            onIonInput={e => setDescription(e.detail.value!)}
                            placeholder="Describe your complaint here"
                            rows={6}
                        />
                    </IonItem>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload"
                        multiple
                    />
                    <IonButton
                        shape="round"
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        <IonIcon slot="icon-only" icon={attach} />
                    </IonButton>
                    <div style={{ marginTop: '10px' }}>
                        {imagePreviews.map((preview, index) => (
                            <IonImg
                                key={index}
                                src={preview as string}
                                alt={`uploaded image ${index + 1}`}
                                style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }}
                            />
                        ))}
                    </div>
                    <IonButton
                        expand="full"
                        type="submit"
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            left: '0',
                            width: '100%',
                            margin: '0',
                            borderRadius: '0'
                        }}
                    >
                        Submit
                    </IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
}

export default CreateTicket;
