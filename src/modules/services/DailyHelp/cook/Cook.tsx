import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonGrid,
  IonText,
  IonIcon,
  IonButton,
  useIonRouter,
  IonFooter,
  useIonToast,
} from "@ionic/react";
import "../Maid/Maid.css";
import maid from "../../../../assets/Images/maid1.png";
import { call, location, star, arrowBack } from "ionicons/icons";

const CookProfile: React.FC = () => {
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [present] = useIonToast();

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Maid is successfully added to household",
      duration: 800,
      position: position,
      cssClass: "custom-toast",
    });
  };
  // Morning and evening shifts
  const morningShift = [
    "5am-6am",
    "7am-8am",
    "9am-11am",
    "5pm-6pm",
    "7pm-8pm",
    "9pm-10pm",
  ];

  const route = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon
              icon={arrowBack}
              size="small"
              className="back-button"
              color="black"
              onClick={() => route.push(`/cook`)}
            />
            Cook Profile
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Profile Section */}
        <IonGrid className="profile-card">
          <IonImg alt="maid" src={maid} />
          <IonGrid className="profile-details">
            <IonText className="profile-header">Aruna</IonText>

            <IonText className="profile-text">
              <IonIcon
                icon={call}
                size="small"
                className="icon-style"
                color="black"
              />
              +91 6932587412
            </IonText>

            <IonText className="profile-text">
              <IonIcon
                icon={location}
                size="small"
                className="icon-style"
                color="black"
              />
              Chandram Palem, Madhurawda, Visakhapatnam
            </IonText>
            <IonText className="profile-text">
              {[...Array(4)].map((_, index) => (
                <IonIcon
                  key={index}
                  icon={star}
                  size="small"
                  className="rate-style"
                />
              ))}
            </IonText>
          </IonGrid>
        </IonGrid>

        {/* Shift Selection */}
        <IonGrid>
          <IonGrid className="shift-card">
            <IonTitle className="shift-title">Available Timings</IonTitle>
            <IonGrid className="timing-card">
              {morningShift.map((slot) => (
                <IonButton
                  key={slot}
                  className="time-slot"
                  color={selectedShift === slot ? "primary" : "light"}
                  onClick={() => setSelectedShift(slot)}
                  style={{
                    backgroundColor:
                      selectedShift === slot ? "#3880ff" : "#fff",
                    color: selectedShift === slot ? "#fff" : "#000",
                  }}
                >
                  {slot}
                </IonButton>
              ))}
            </IonGrid>
          </IonGrid>
        </IonGrid>
        <IonGrid className="button">
          <IonButton expand="block" onClick={() => presentToast("bottom")}>
            Add service to households
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CookProfile;
