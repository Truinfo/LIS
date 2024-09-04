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
} from "@ionic/react";
import "./Maid.css";
import maid from "../../../assets/Images/maid1.png";
import { call } from "ionicons/icons";
const Maid: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Maid</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="profile-card">
          <IonImg alt="maid" src={maid} />
          <IonGrid className="profile-details">
            <IonText className="profile-header">Aruna</IonText>
            <IonText className="profile-text">
              {" "}
              <IonIcon
                icon={call}
                size="small"
                className="icon-style"
                color="black"
              />{" "}
              +91 6932587412
            </IonText>
            <IonText className="profile-header">Aruna</IonText>
          </IonGrid>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Maid;
