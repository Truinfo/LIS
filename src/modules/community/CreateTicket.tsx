import React, { useState } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonLabel, IonItem, IonInput, IonTextarea, IonButton, IonIcon, IonImg, IonRadio, IonRadioGroup, IonList, IonGrid, IonRow, IonCol, IonFooter } from '@ionic/react';
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
            <IonContent fullscreen>
                <form onSubmit={handleSubmit}>
                    <IonGrid>
                        <IonRow>
                            <IonRadioGroup value={selectedRadio} style={{ display: "flex" }} onIonChange={e => setSelectedRadio(e.detail.value)}>
                                <IonCol size="auto">
                                    <IonItem lines="none">
                                        <IonLabel>Personal</IonLabel>
                                        <IonRadio slot="start" value="personal" />
                                    </IonItem>
                                </IonCol>
                                <IonCol size="auto">
                                    <IonItem lines="none">
                                        <IonLabel>Community</IonLabel>
                                        <IonRadio slot="start" value="community" />
                                    </IonItem>
                                </IonCol>
                            </IonRadioGroup>
                        </IonRow>
                    </IonGrid>
                    {/* {selectedRadio === 'community' && ( */}
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
                    {/* )} */}
                    <IonItem>
                        <IonLabel position="floating">Block Number</IonLabel>
                        <IonInput
                            value={blockNumber}
                            onIonInput={e => setBlockNumber(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Flat Number</IonLabel>
                        <IonInput
                            value={flatNumber}
                            onIonInput={e => setFlatNumber(e.detail.value!)}
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
                        className='ion-margin'
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        <IonIcon slot="icon-only" icon={attach} /> Upload
                    </IonButton>
                    <div style={{ display: "flex", margin: '10px', borderRadius: '10px' }}>
                        {imagePreviews.map((preview, index) => (
                            <IonImg
                                key={index}
                                src={preview as string}
                                alt={`uploaded image ${index + 1}`}
                                style={{ margin: '10px', borderRadius: '10px', maxWidth: '100%', height: '75px' }}
                            />
                        ))}
                    </div>

                </form>
            </IonContent>
            <IonFooter className='custom-footer'><IonButton
                expand="full"
                type="submit"
                style={{ padding: "20px"}}
            >
                Submit
            </IonButton></IonFooter>
        </IonPage>
    );
}

export default CreateTicket;
