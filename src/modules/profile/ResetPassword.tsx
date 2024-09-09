import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    IonText
} from "@ionic/react";
import { useState } from "react";

const ResetPassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

    const handleSubmit = () => {
        if (newPassword === confirmPassword) {
            console.log("Current Password:", currentPassword);
            console.log("New Password:", newPassword);
        } else {
            setPasswordsMatch(false);
        }
    };

    const handleIonChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: CustomEvent) => {
        setter(e.detail.value as string);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Reset Password</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonItem>
                    <IonLabel position="floating">Current Password</IonLabel>
                    <IonInput
                        type="password"
                        value={currentPassword}
                        onIonChange={handleIonChange(setCurrentPassword)}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">New Password</IonLabel>
                    <IonInput
                        type="password"
                        value={newPassword}
                        onIonChange={handleIonChange(setNewPassword)}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Confirm Password</IonLabel>
                    <IonInput
                        type="password"
                        value={confirmPassword}
                        onIonChange={handleIonChange(setConfirmPassword)}
                    />
                </IonItem>
                {!passwordsMatch && (
                    <IonText color="danger" >
                        <p style={{marginLeft:"10px"}}>Passwords do not match.</p>
                    </IonText>
                )}
            </IonContent>
            <IonFooter className='custom-footer'>
                <IonButton expand="full" onClick={handleSubmit}>
                    Submit
                </IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default ResetPassword;
