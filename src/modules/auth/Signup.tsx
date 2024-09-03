// src/pages/Signup.tsx

import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonLoading,
  IonAlert,
} from "@ionic/react";

const Signup: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleSignup = async () => {
    if (mobileNumber.length < 10) {
      setAlertMessage("Please enter a valid mobile number");
      setShowAlert(true);
      return;
    }
    setLoading(true);
    try {
      setLoading(false);
      setShowAlert(true);
    } catch (error) {
      setLoading(false);
      setAlertMessage("Failed to send OTP. Please try again.");
      setShowAlert(true);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Mobile Number</IonLabel>
          <IonInput
            type="tel"
            value={mobileNumber}
            onIonChange={(e) => setMobileNumber(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleSignup}>
          Send OTP
        </IonButton>
        {/* Loading Indicator */}
        <IonLoading isOpen={loading} message={"Please wait..."} />
        {/* Alert for messages */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Alert"}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Signup;
