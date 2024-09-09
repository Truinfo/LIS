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
  useIonToast,
  useIonRouter,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonItem,
} from "@ionic/react";
import "../Maid/Maid.css";
import maid from "../../../../assets/Images/maid1.png";
import { call, location, star, arrowBack } from "ionicons/icons";

const WaterProfile: React.FC = () => {
  // State to track selected newspaper
  const [selectedNewspaper, setSelectedNewspaper] = useState<string | null>(
    null
  );

  // List of newspapers
  const newspapers = ["RO", "Minural"];

  const [present] = useIonToast();
  const route = useIonRouter();

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Maid is successfully added to household",
      duration: 800,
      position: position,
      cssClass: "custom-toast",
    });
  };

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
              onClick={() => route.push(`/water`)}
            />
            Water Plant Profile
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Profile Section */}
        <IonGrid className="profile-card">
          <IonImg alt="maid" src={maid} />
          <IonGrid className="profile-details">
            <IonText className="profile-header">Kumar</IonText>
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

        {/* Newspaper Selection using Radio Buttons */}
        <IonGrid>
          <IonGrid className="shift-card">
            <IonTitle className="shift-title">Select a water type</IonTitle>
            <IonRadioGroup
              value={selectedNewspaper}
              onIonChange={(e) => setSelectedNewspaper(e.detail.value)}
            >
              {newspapers.map((paper, index) => (
                <IonItem key={index}>
                  <IonLabel>{paper}</IonLabel>
                  <IonRadio slot="start" value={paper} />
                </IonItem>
              ))}
            </IonRadioGroup>
          </IonGrid>
        </IonGrid>

        {/* Button to Add Service */}
        <IonGrid className="button">
          <IonButton expand="block" onClick={() => presentToast("bottom")}>
            Add service to households
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WaterProfile;
